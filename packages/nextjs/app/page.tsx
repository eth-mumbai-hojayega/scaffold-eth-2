"use client"
import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ReactFlow from "~~/components/reactflow";
import { Address } from "~~/components/scaffold-eth";
import Card from "~~/components/Card";
import fakeData from "~~/components/data/fakeData";
import React, { useState } from 'react';
import Modal from '~~/components/JourneyModal';
import NodeModal from '~~/components/NodeModal';

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleSelectItem = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };
  return (
    <div className="">
      <div className="flex justify-center my-4">
        <button onClick={handleSelectItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Select Item
        </button>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {fakeData.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Render the modal component */}
      <NodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
