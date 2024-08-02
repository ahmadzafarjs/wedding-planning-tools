import React, { useEffect, useState } from "react";
import BudgetAside from "../features/budget/BudgetAside";
import BudgetHome from "../features/budget/BudgetHome";
import BudgetExpenses from "../features/budget/BudgetExpenses";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function BudgetPage() {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsQuery = searchParams.get("category");
  const [params, setParams] = useState(searchParams.get("category"));

  const queryClient = useQueryClient();

  async function getCategories() {
    try {
      const token = localStorage.getItem("token"); // Corrected getItem method
      const res = await axios.post(
        "http://localhost:3000/budget/categories/all",
        { token }
      );
      const data = await res.data; // Assuming data is an array of categories
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Handle error (e.g., set error state or show a message)
    }
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 2000,
  });

  useEffect(() => {
    const filter = data?.categories.find((cat) => cat.name == params);
    setFilteredCategories(filter);
  }, [params, data?.categories, filteredCategories]);

  return (
    <section className="flex gap-10">
      <div className="w-[30%]">
        <BudgetAside
          setParams={setParams}
          data={data}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
      <div className="w-[70%]">
        {paramsQuery ? (
          <BudgetExpenses
            isLoading={isLoading}
            data={data}
            refetch={refetch}
            filteredCategories={filteredCategories}
            params={params}
          />
        ) : (
          <BudgetHome data={data} refetch={refetch} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
}
