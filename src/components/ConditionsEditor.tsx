"use client";

import React, { useState } from "react";
import { Page, PostCondition } from "@/utils/types";

type ConditionsEditorProps = {
  page: Page;
  allPages: Page[];
  onAddPostCondition: (postCondition: PostCondition) => void;
  onDeletePostCondition: (index: number) => void;
};

export default function ConditionsEditor({
  page,
  allPages,
  onAddPostCondition,
  onDeletePostCondition,
}: ConditionsEditorProps) {
  const [postConditionQuestionIndex, setPostConditionQuestionIndex] =
    useState<number>(-1);
  const [postConditionValue, setPostConditionValue] = useState<string | number>(
    ""
  );
  const [postConditionOperator, setPostConditionOperator] =
    useState<string>("="); // Default operator
  const [postConditionNextPageId, setPostConditionNextPageId] =
    useState<string>("");

  const resetPostConditionFields = () => {
    setPostConditionQuestionIndex(-1);
    setPostConditionValue("");
    setPostConditionOperator("=");
    setPostConditionNextPageId("");
  };

  const handleAddPostCondition = () => {
    if (
      postConditionQuestionIndex < 0 ||
      postConditionValue === "" ||
      postConditionNextPageId === ""
    ) {
      alert(
        "Vær sikker på at du har valgt et spørgsmål, en værdi eller en operator og den næste side som skal kunne tilgås."
      );
      return;
    }

    onAddPostCondition({
      condition: {
        questionIndex: postConditionQuestionIndex,
        value: postConditionValue,
        operator: postConditionOperator,
      },
      nextPageId: postConditionNextPageId,
    });

    resetPostConditionFields();
  };

  const getInputField = (
    inputType: string,
    options: string[] | undefined,
    value: string | number,
    onChange: (value: string | number) => void
  ) => {
    if (inputType === "checkbox" && options) {
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else if (inputType === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border p-2 rounded"
          placeholder="Enter numeric value"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter value"
        />
      );
    }
  };

  return (
    <div className="border p-4 rounded max-w-sm">
      <h2 className="font-semibold text-lg mb-4">
        Conditions for: {page.name}
      </h2>

      {/* Post-Conditions Section */}
      <div>
        <h3 className="font-medium mb-2">Post-Conditions</h3>
        <ul className="mb-4">
          {page.postConditions?.map((cond, index) => (
            <li
              key={index}
              className="border p-2 rounded mb-2 flex justify-between items-center"
            >
              <span>
                Hvis spørgsmål {cond.condition.questionIndex + 1}{" "}
                <strong>{cond.condition.operator}</strong>{" "}
                <strong>{cond.condition.value}</strong>, gå til {" "}
                <strong>{cond.nextPageId}</strong>
              </span>
              <button
                onClick={() => onDeletePostCondition(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Slet
              </button>
            </li>
          )) || <p>Ingen post-conditions tilføjet.</p>}
        </ul>

        <div className="flex flex-col space-y-2">
          <select
            value={postConditionQuestionIndex}
            onChange={(e) =>
              setPostConditionQuestionIndex(Number(e.target.value))
            }
            className="border p-2 rounded"
          >
            <option value="-1">Vælg et spørgsmål</option>
            {page.questions.map((q, index) => (
              <option key={index} value={index}>
                {index + 1}. {q.text}
              </option>
            ))}
          </select>

          {postConditionQuestionIndex >= 0 &&
            getInputField(
              page.questions[postConditionQuestionIndex].inputType,
              page.questions[postConditionQuestionIndex].options,
              postConditionValue,
              setPostConditionValue
            )}

          {postConditionQuestionIndex >= 0 &&
            page.questions[postConditionQuestionIndex].inputType === "number" && (
              <select
                value={postConditionOperator}
                onChange={(e) => setPostConditionOperator(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="=">=</option>
                <option value=">">{">"}</option>
                <option value="<">{"<"}</option>
                <option value=">=">≥</option>
                <option value="<=">≤</option>
              </select>
            )}

          <select
            value={postConditionNextPageId}
            onChange={(e) => setPostConditionNextPageId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Vælg næste side</option>
            {allPages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddPostCondition}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tilføj Post-Condition
          </button>
        </div>
      </div>
    </div>
  );
}

