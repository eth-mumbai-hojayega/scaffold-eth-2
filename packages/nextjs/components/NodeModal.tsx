import React, { useEffect, useState } from "react";
import ButtonModal from "./ButtonModal";
import FrameRender from "./FrameRender";
// Import the FrameRender component
import { Frame, FrameButton } from "frames.js";
import { useJourneyForProduct } from "~~/providers/ReactFlow";
import { createFrame, getFrameById, updateFrame } from "~~/utils/apis";
import { notification } from "~~/utils/scaffold-eth";

// Import the Frame type

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NodeModal: React.FC<NodeModalProps> = ({ isOpen, onClose }) => {
  const { currentNode, updateNode } = useJourneyForProduct();
  const handleClose = () => {
    onClose();
  };

  const handleAddFrame = async () => {
    const frame: Frame = {
      buttons: [],
      image: "",
      inputText: "",
      version: "vNext",
      postUrl: "",
    };

    const response = await createFrame({
      name: currentNode?.data?.label,
      frameJson: frame,
    });
    notification.success("Frame created successfully");
    updateNode(currentNode?.id as string, {
      frameId: response._id as string,
    });
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "block" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <label htmlFor="nodeName" className="block text-sm font-medium text-gray-700 mb-1">
              Enter a name for the Frame
            </label>
            <input
              id="nodeName"
              type="text"
              value={currentNode?.data?.label || ""}
              onChange={e => {
                updateNode(currentNode?.id as string, {
                  label: e.target.value,
                });
              }}
              placeholder="Frame Name"
              className="w-full p-2 mb-4 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-black"
            />

            {currentNode?.data?.frameId !== "" && currentNode?.data?.frameId !== undefined ? (
              <FrameForm />
            ) : (
              <button className="btn btn-primary" onClick={handleAddFrame}>
                Create Frame
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
export const handleGenerateJson = ({
  buttons,
  image,
  inputText,
}: {
  buttons: any[];
  image: string;
  inputText: string;
}) => {
  const json: Frame = {
    buttons: buttons,
    version: "vNext",
    image,
    inputText,
    postUrl: "https://zizzamia.xyz/api/frame",
  };
  return json;
};
const FrameForm = () => {
  const { currentNode, updateNode } = useJourneyForProduct();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [additionalInput, setAdditionalInput] = useState<string>("");
  const [buttons, setButtons] = useState<{ action?: string; label: string; target?: string }[]>([]);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [imageUrlOption, setImageUrlOption] = useState("url"); // State to track the selected option
  // const [imageUrl, setImageUrl] = useState(""); // State to store the entered image URL
  const [htmlCode, setHtmlCode] = useState<string>(""); // State to store the entered HTML code

  useEffect(() => {
    const fetchData = async () => {
      if (currentNode?.data?.frameId) {
        const frame = await getFrameById(currentNode.data.frameId);
        console.log({ frame });
        setImageUrl(frame?.frameJson?.image);
        setAdditionalInput(frame?.frameJson?.inputText);
        setButtons(frame?.frameJson?.buttons || []);
      }
    };

    fetchData();
  }, [currentNode]);

  const handleAddButton = () => {
    setButtons([...buttons, { label: `Button ${buttons.length + 1}` }]);
  };

  const handleButtonClick = (index: number) => {
    setActiveButtonIndex(index);
  };

  const handleSaveButton = (button: { action?: string; label: string; target?: string }) => {
    if (activeButtonIndex !== null) {
      if (button.label === "") {
        button.label = `Button ${activeButtonIndex + 1}`;
      }
      const updatedButtons = [...buttons];
      updatedButtons[activeButtonIndex] = button;
      setButtons(updatedButtons);
      setActiveButtonIndex(null);
    }
  };

  const saveFrame = async () => {
    const frameToUpdate = handleGenerateJson({
      buttons,
      image: imageUrl,
      inputText: additionalInput,
    });
    const response = await updateFrame(currentNode?.data.frameId as string, {
      frameJson: frameToUpdate as Frame,
    });
    notification.success("Frame updated successfully");
    console.log({ response });
  };

  return (
    <>
      <div className="flex">
        <div className="block text-sm font-medium text-gray-700 mb-1 mr-2">Edit</div>
        <input
          id="theme-toggle"
          type="checkbox"
          className="toggle toggle-primary bg-primary hover:bg-primary border-primary"
          onChange={() => setIsPreview(!isPreview)}
          checked={isPreview}
        />
        <div className="block text-sm font-medium text-gray-700 mb-1 ml-2">Preview</div>
      </div>
      <>
        {isPreview ? (
          <>
            <div className="mt-5 sm:mt-6">
              <FrameRender
                frame={handleGenerateJson({
                  buttons,
                  image: imageUrl,
                  inputText: additionalInput,
                })} // Pass the generated JSON as props to FrameRender
                isLoggedIn={true} // Assuming isLoggedIn is always true
                submitOption={async () => {
                  await Promise.resolve();
                }}
              />
              <button
                onClick={saveFrame}
                type="button"
                className="inline-flex justify-center w-full border border-transparent mt-2 px-4 py-2 bg-blue-500 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm rounded-md"
              >
                Save Frame
              </button>
            </div>
          </>
        ) : (
          <>
            <label htmlFor="imageInput" className="block text-sm font-medium text-gray-700 mb-1 mt-2">
              Select Input Type
            </label>
            <select
              id="imageInput"
              value={imageUrlOption}
              onChange={e => {
                setImageUrlOption(e.target.value);
                setImageUrl(""); // Clear the input box value when the dropdown selection changes
              }}
              className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-black"
            >
              <option value="url">Image</option>
              <option value="html">HTML</option>
            </select>

            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              {imageUrlOption === "url" ? "Enter Image URL" : "Enter HTML Code"}
            </label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder={imageUrlOption === "url" ? "Image URL" : "HTML Code"}
              className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-black"
            />

            <label htmlFor="buttons" className="block text-sm font-medium text-gray-700 mb-1">
              Add Required Number of Buttons
            </label>
            <div className="flex flex-wrap gap-1 mb-4">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className="btn btn-primary"
                  onClick={() => handleButtonClick(index)}
                  style={{ margin: "0.5rem" }} // Adjust the margin as needed
                >
                  {button.label}
                </button>
              ))}
            </div>

            {buttons.length < 4 && (
              <button onClick={handleAddButton} className="btn btn-primary w-40 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 mr-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Button
              </button>
            )}
            <label htmlFor="additionalInput" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Additional Input
            </label>
            <input
              id="additionalInput"
              type="text"
              value={additionalInput}
              onChange={e => setAdditionalInput(e.target.value)}
              placeholder="Additional Input"
              className="w-full p-2 mb-4 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-black"
            />
            <button
              onClick={saveFrame}
              type="button"
              className="inline-flex justify-center w-full border border-transparent mt-2 px-4 py-2 bg-blue-500 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm rounded-md"
            >
              Save Frame
            </button>
          </>
        )}
      </>
      {activeButtonIndex !== null && (
        <ButtonModal
          isOpen={true}
          onClose={() => setActiveButtonIndex(null)}
          onSave={handleSaveButton}
          initialValue={buttons[activeButtonIndex]}
        />
      )}
    </>

    //   {/* Render the FrameRenderModal if isFrameRenderModalOpen is true */}
    //   {isFrameRenderModalOpen && (
    //     <FrameRender
    //     isOpen={true}
    //       frame={generatedJson} // Pass the generated JSON as props to FrameRender
    //       isLoggedIn={true} // Assuming isLoggedIn is always true
    //       onClose={() => setIsFrameRenderModalOpen(false)} // Close the FrameRender modal
    //       submitOption={async () => {
    //         await Promise.resolve();
    //       }}
    //     />
    //   )}
    // </div>
  );
};
