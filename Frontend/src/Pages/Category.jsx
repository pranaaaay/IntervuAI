import React from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const categories = [
    { name: "Java", path: "section/java" },
    { name: "MERN", path: "section/mern" },
    { name: "Node.js", path: "section/node" },
    { name: "SQL", path: "section/sql" },
    { name: "DSA", path: "section/dsa" },
    { name: "JavaScript", path: "section/javascript" },
    { name: "HR", path: "section/hr" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">

        <h1 className="text-center mb-12 text-4xl font-medium text-white">
          What kind of interview would you like to practice?
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="w-full max-w-xs"
            >
              <button
                className="w-full py-12 rounded-xl
                bg-slate-200 text-3xl font-medium
                hover:bg-slate-900 hover:text-white
                hover:shadow-2xl
                transition-all duration-300"
              >
                {category.name}
              </button>
            </Link>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Category;