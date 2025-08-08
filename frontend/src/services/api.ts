export const getHealth = async () => {
  const response = await fetch("http://localhost:8000/api/v1/health");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};