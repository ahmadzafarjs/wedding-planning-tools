import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export async function useAddCategory() {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (cat) => {
      const token = localStorage.getItem("token"); // Corrected getItem method
      const res = await axios.post("http://localhost:3000/budget/category", {
        name: cat,
        token: token, // Use the retrieved token
      });
      return res.data; // Assuming you want to return data from the response
    },
  });

  return {
    mutate,
    isLoading,
  };
}
