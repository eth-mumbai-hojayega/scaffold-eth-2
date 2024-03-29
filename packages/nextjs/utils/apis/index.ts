import { Frame, FrameJson, Journey } from "~~/types/commontypes";

const API_URL = "http://localhost:3000/api";

export const getProductById = async (id: string) => {
  const response = await fetch(`${API_URL}/journey/${id}`);
  const product = await response.json();
  return product;
};

export const updateProduct = async (id: string, data: Partial<Journey>) => {
  const response = await fetch(`${API_URL}/journey/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const product = await response.json();
  return product;
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/journey/${id}`, {
    method: "DELETE",
  });
  const product = await response.json();
  return product;
};

export const createProduct = async (data: Journey) => {
  const response = await fetch(`${API_URL}/journey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const product = await response.json();
  return product;
};

export const createFrame = async (data: Frame) => {
  const response = await fetch(`${API_URL}/frame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const frame = await response.json();
  return frame;
};

export const updateFrame = async (id: string, data: Partial<FrameJson>) => {
  const response = await fetch(`${API_URL}/frame/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const frame = await response.json();
  return frame;
};

export const deleteFrame = async (id: string) => {
  const response = await fetch(`${API_URL}/frame/${id}`, {
    method: "DELETE",
  });
  const frame = await response.json();
  return frame;
};

export const getFrameById = async (id: string) => {
  const response = await fetch(`${API_URL}/frame/${id}`);
  const frame = await response.json();
  return frame;
};
