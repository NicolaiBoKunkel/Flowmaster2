"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftNavBar from "../../../components/navbar";
import NumericQuestion from "../../../components/NumericQuestion";
import TextQuestion from "../../../components/TextQuestion";
import MultipleChoiceQuestion from "../../../components/MultipleChoiceQuestion";
import CheckboxQuestion from "../../../components/CheckboxQuestion";
import CalendarQuestion from "../../../components/CalendarQuestion";
import DropdownQuestion from "../../../components/DropdownQuestion";
import TekstBlock from "@/components/TekstBlock";
import FlowVisualization from "../../../components/FlowVisualization";
import { updateFlow, getFlows } from "@/utils/flowStorage";
import ConditionsEditor from "../../../components/ConditionsEditor";
import PlayMode from "@/components/PlayMode";
import { Flow, Page, Question } from "@/utils/types";

const evaluateCondition = (
  operator: string,
  userAnswer: number | string | string[],
  conditionValue: number | string
): boolean => {
  if (Array.isArray(userAnswer)) {
    // For checkbox questions, check if conditionValue is included in userAnswer
    return userAnswer.includes(conditionValue as string);
  }

  switch (operator) {
    case "=":
      return userAnswer === conditionValue;
    case ">":
      return userAnswer > conditionValue;
    case "<":
      return userAnswer < conditionValue;
    case ">=":
      return userAnswer >= conditionValue;
    case "<=":
      return userAnswer <= conditionValue;
    default:
      return false;
  }
};

export default function FlowEditor() {
  const params = useParams();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [isVisualizationMode, setIsVisualizationMode] = useState(false);
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [questionType, setQuestionType] = useState<
  "number" | "text" | "multiple-choice" | "checkbox" | "calendar" | "dropdown" | "tekst-block"
>("number");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewAnswers, setPreviewAnswers] = useState<
    Record<number, string | number | string[]>
  >({});
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  useEffect(() => {
    const flowId = params.flow as string;
    const flows = JSON.parse(localStorage.getItem("flows") || "[]") as Flow[];
    const currentFlow = flows.find((f) => f.id === flowId) || null;

    if (currentFlow) {
      if (!currentFlow.pages) {
        currentFlow.pages = [];
        const updatedFlows = flows.map((f) =>
          f.id === currentFlow.id ? currentFlow : f
        );
        localStorage.setItem("flows", JSON.stringify(updatedFlows));
      }
    }

    setFlow(currentFlow);
  }, [params.flow]);

  useEffect(() => {
    if (flow) {
      const timeoutId = setTimeout(() => {
        updateFlow(flow);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [flow]);

  const handleAddPage = () => {
    if (!flow) return;

    const newPageId = `page${flow.pages.length + 1}`;
    const newPage: Page = {
      id: newPageId,
      name: `Side ${flow.pages.length + 1}`,
      questions: [],
    };

    const updatedFlow: Flow = {
      ...flow,
      pages: [...flow.pages, newPage],
    };

    // Update flows in local storage
    updateFlow(updatedFlow);
    setFlow(updatedFlow);
    setCurrentPageIndex(updatedFlow.pages.length - 1);
  };

  const handleDeletePage = () => {
    if (!flow || !flow.pages || flow.pages.length === 0) {
      return;
    }

    const updatedPages = flow.pages.filter((_, i) => i !== currentPageIndex);

    const updatedFlow: Flow = {
      ...flow,
      pages: updatedPages,
    };

    updateFlow(updatedFlow);

    setFlow(updatedFlow);

    let newIndex = currentPageIndex;
    if (newIndex >= updatedPages.length) {
      newIndex = updatedPages.length - 1;
    }
    setCurrentPageIndex(newIndex);

    if (updatedPages.length < 1) {
      handleAddPage();
    }
  };

  const handleAddQuestion = (question: Question) => {
    if (!flow) return;

    const updatedPages = flow.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          questions: [...page.questions, question],
        };
      }
      return page;
    });

    const updatedFlow: Flow = {
      ...flow,
      pages: updatedPages,
    };

    updateFlow(updatedFlow);

    setFlow(updatedFlow);
  };

  // NEW FUNCTION: Delete a specific question from the current page
  const handleDeleteQuestion = (questionIndex: number) => {
    if (!flow) return;

    const updatedPages = flow.pages.map((page, pIndex) => {
      if (pIndex === currentPageIndex) {
        return {
          ...page,
          questions: page.questions.filter(
            (_, qIndex) => qIndex !== questionIndex
          ),
        };
      }
      return page;
    });

    const updatedFlow: Flow = {
      ...flow,
      pages: updatedPages,
    };

    updateFlow(updatedFlow);
    setFlow(updatedFlow);
  };

  const handleNextPage = () => {
    if (!flow) return;

    const currentPage = flow.pages[currentPageIndex];
    let nextPageIndex = currentPageIndex + 1; // Default to sequential navigation

    // Evaluate post-conditions on the current page
    if (currentPage.postConditions?.length) {
      const matchedPostCondition = currentPage.postConditions.find(
        (condition) => {
          const userAnswer = previewAnswers[condition.condition.questionIndex]; // User's input
          const conditionValue = condition.condition.value;
          const operator = condition.condition.operator || "=";

          return evaluateCondition(operator, userAnswer, conditionValue);
        }
      );

      if (matchedPostCondition) {
        const targetPageIndex = flow.pages.findIndex(
          (page) => page.id === matchedPostCondition.nextPageId
        );
        if (targetPageIndex !== -1) {
          nextPageIndex = targetPageIndex;
          setCurrentPageIndex(nextPageIndex);
          return; // Exit early if post-condition is matched
        }
      }
    }

    // Update to the determined next page if valid
    if (nextPageIndex < flow.pages.length) {
      setCurrentPageIndex(nextPageIndex);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleAnswerChange = (
    index: number,
    value: string | number | string[]
  ) => {
    setPreviewAnswers((prev) => ({ ...prev, [index]: value }));
  };

  if ((flow?.pages?.length ?? 0) < 1) {
    handleAddPage();
  }

  const handleDownloadFlow = (flowId: string) => {
    const flows = getFlows();

    const flowToDownload = flows.find((f) => f.id === flowId);
    if (!flowToDownload) {
      return;
    }

    const flowJsonString = JSON.stringify(flowToDownload, null, 2);
    const blob = new Blob([flowJsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${flowToDownload.name || "flow"}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (!flow) return <div>Loading...</div>;

  return (
    <div className="flex">
      {!isPlayMode && (
        <>
          <LeftNavBar
            onQuestionTypeChange={(type) => setQuestionType(type)}
            flowName={flow.name}
          />
          <div className="ml-48 p-6 w-full">
            <h1 className="text-2xl font-bold mb-4">
              {isVisualizationMode
                ? `Flow Visualization: ${flow.name}`
                : isPreview
                ? `Preview: ${flow.name}`
                : `Editing Flow: ${flow.name}`}
            </h1>
            <p className="text-gray-600 mb-6">{flow.description}</p>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setIsPlayMode((prev) => !prev)}
                className={`px-4 py-2 rounded ${
                  isPlayMode
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                {isPlayMode ? "Afslut Play Mode" : "Gå ind i Play Mode"}
              </button>

              <button
                type="button"
                onClick={() => setIsVisualizationMode(!isVisualizationMode)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isVisualizationMode
                  ? "Deaktiver visualisering"
                  : "Aktiver visualisering"}
              </button>

              <button
                onClick={() => handleDownloadFlow(flow.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Flow
              </button>
            </div>

            {isPlayMode && (
              <PlayMode flow={flow} onExit={() => setIsPlayMode(false)} />
            )}
            {isVisualizationMode && (
              <FlowVisualization
                flow={flow}
                onSwitchPage={(pageIndex) => setCurrentPageIndex(pageIndex)}
                onDeletePage={(pageId) => {
                  // Filter out the page with the matching ID
                  const updatedPages = flow.pages.filter(
                    (page) => page.id !== pageId
                  );

                  // Update the flow with the remaining pages
                  setFlow({ ...flow, pages: updatedPages });

                  // Adjust the current page index if necessary
                  if (currentPageIndex >= updatedPages.length) {
                    setCurrentPageIndex(Math.max(0, updatedPages.length - 1));
                  }
                }}
              />
            )}

            {/* Page Navigation */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setCurrentPageIndex(0)}
                disabled={currentPageIndex === 0}
                className={`px-3 py-1 rounded ${
                  currentPageIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Første side
              </button>

              <button
                onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
                className={`px-3 py-1 rounded ${
                  currentPageIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Forrige side
              </button>

              <span className="px-3 py-1 rounded bg-blue-500 text-white">
                Side {currentPageIndex + 1} of {flow.pages.length}
              </span>

              <button
                onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
                disabled={currentPageIndex === flow.pages.length - 1}
                className={`px-3 py-1 rounded ${
                  currentPageIndex === flow.pages.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Næste side
              </button>

              <button
                onClick={() => setCurrentPageIndex(flow.pages.length - 1)}
                disabled={currentPageIndex === flow.pages.length - 1}
                className={`px-3 py-1 rounded ${
                  currentPageIndex === flow.pages.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Sidste side
              </button>

              <button
                type="button"
                onClick={handleAddPage}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Tilføj ny side
              </button>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  const confirmation = window.confirm(
                    "Er du sikker på, at du vil slette denne side?"
                  );
                  if (confirmation) {
                    handleDeletePage();
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Slet side
              </button>
            </div>

            {!isPreview ? (
              <>
                {questionType === "number" ? (
                  <NumericQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "text" ? (
                  <TextQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "multiple-choice" ? (
                  <MultipleChoiceQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "checkbox" ? (
                  <CheckboxQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "calendar" ? (
                  <CalendarQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "dropdown" ? (
                  <DropdownQuestion onAddQuestion={handleAddQuestion} />
                ) : questionType === "tekst-block" ? ( 
                  <TekstBlock onAddTekstBlock={handleAddQuestion} /> 
                ) : null}
                

                
                <h2 className="text-xl font-semibold mt-6">
                  Spørgsmål og conditions på side{" "}
                  {flow.pages[currentPageIndex]?.name}
                </h2>
                <ul className="space-y-4 max-w-sm">
                  {flow.pages[currentPageIndex]?.questions.map((q, index) => (
                    <li
                      key={index}
                      className="border p-4 rounded shadow-sm bg-gray-50"
                    >
                      <p className="font-medium">{q.text}</p>
                      <p>Type: {q.inputType}</p>

                      {/* Handling for number input */}
                      {q.inputType === "number" && <p>Spørgsmål: {q.text}</p>}

                      {/* handling for text input */}
                      {q.inputType === "text" && (
                        <p>Placeholdertekst: {q.placeholder ?? "None"}</p>
                      )}

                      {/* handling for multiple-choice */}
                      {q.inputType === "multiple-choice" && (
                        <ul className="space-y-2">
                          {q.answers?.map((answer, answerIndex) => (
                            <li
                              key={answerIndex}
                              className="border p-2 rounded"
                            >
                              {answer}
                            </li>
                          ))}
                          <p>
                            Tillad flere svar:{" "}
                            {q.allowMultipleAnswers ? "Ja" : "Nej"}
                          </p>
                        </ul>
                      )}

                      {/* handling for checkbox input */}
                      {q.inputType === "checkbox" && (
                        <>
                          <p>Svar:</p>
                          <ul className="space-y-2">
                            {q.options?.map((option, optionIndex) => (
                              <li
                                key={optionIndex}
                                className="border p-2 rounded"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {/* handling for dropdown input */}
                      {q.inputType === "dropdown" && (
                        <>
                          <p>Svar:</p>
                          <ul className="space-y-2">
                            {q.options?.map((option, optionIndex) => (
                              <li
                                key={optionIndex}
                                className="border p-2 rounded"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {/* handling for calendar input */}
                      {q.inputType === "calendar" && (
                        <p>Dette er et Kalender spørgsmål.</p>
                      )}

                      
                      {q.inputType === "tekst-block" ? (
                      <>
                      <p className="font-bold">{q.text}</p> {/* Titel */}
                      <p className="italic">{q.body || q.placeholder}</p> {/* Brødtekst */}
                      </>
                      ) : (
                      <>
                      {/* rendering for andre typer */}
                      <p className="font-medium">{q.text}</p>
                      </>
                      )}


                      {/* Delete Question Button */}
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
                      >
                        Slet
                      </button>
                    </li>
                  ))}
                </ul>

                <ConditionsEditor
                  page={flow.pages[currentPageIndex]}
                  allPages={flow.pages}
                  onAddPostCondition={(postCondition) => {
                    const updatedPages = flow.pages.map((page, index) =>
                      index === currentPageIndex
                        ? {
                            ...page,
                            postConditions: [
                              ...(page.postConditions || []),
                              postCondition,
                            ],
                          }
                        : page
                    );
                    const updatedFlow = { ...flow, pages: updatedPages };
                    updateFlow(updatedFlow);
                    setFlow(updatedFlow);
                  }}
                  onDeletePostCondition={(index) => {
                    const updatedPages = flow.pages.map((page, pageIndex) =>
                      pageIndex === currentPageIndex
                        ? {
                            ...page,
                            postConditions: page.postConditions?.filter(
                              (_, i) => i !== index
                            ),
                          }
                        : page
                    );
                    const updatedFlow = { ...flow, pages: updatedPages };
                    updateFlow(updatedFlow);
                    setFlow(updatedFlow);
                  }}
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Spørgsmål {flow.pages[currentPageIndex]?.name}
                </h2>
                <ul className="space-y-4 max-w-sm">
                  {flow.pages[currentPageIndex]?.questions.map((q, index) => (
                    <li
                      key={index}
                      className="border p-4 rounded shadow-sm bg-gray-50">
                      <p className="font-medium">{q.text}</p>

                      {q.inputType === "number" ? (
                        // handling for number input
                        <div className="mt-2">
                          <input
                            type="number"
                            onChange={(e) =>
                              handleAnswerChange(index, Number(e.target.value))
                            }
                            className="border p-2 rounded w-full"
                          />
                        </div>
                      ) : q.inputType === "text" ? (
                        // handling for text input
                        <input
                          type="text"
                          placeholder={q.placeholder ?? ""}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          className="border p-2 rounded w-full"
                        />
                      ) : q.inputType === "multiple-choice" ? (
                        // handling for multiple-choice
                        <div className="mt-2">
                          {q.answers?.map((answer, answerIndex) => (
                            <button
                              key={answerIndex}
                              onClick={() => {
                                if (q.allowMultipleAnswers) {
                                  const currentAnswers = Array.isArray(
                                    previewAnswers[index]
                                  )
                                    ? (previewAnswers[index] as string[])
                                    : [];
                                  const newAnswers = currentAnswers.includes(
                                    answer
                                  )
                                    ? currentAnswers.filter((a) => a !== answer)
                                    : [...currentAnswers, answer];
                                  handleAnswerChange(index, newAnswers);
                                } else {
                                  handleAnswerChange(index, answer);
                                }
                              }}
                              className={`border p-2 rounded w-full text-left ${
                                (Array.isArray(previewAnswers[index]) &&
                                  previewAnswers[index].includes(answer)) ||
                                previewAnswers[index] === answer
                                  ? "bg-blue-100"
                                  : ""
                              }`}
                            >
                              {answer}
                            </button>
                          ))}
                        </div>
                      ) : q.inputType === "checkbox" ? (
                        // handling for checkbox input
                        <div className="mt-2">
                          {q.options?.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                checked={
                                  Array.isArray(previewAnswers[index])
                                    ? (
                                        previewAnswers[index] as string[]
                                      ).includes(option)
                                    : false
                                }
                                onChange={(e) => {
                                  const selectedOptions = Array.isArray(
                                    previewAnswers[index]
                                  )
                                    ? (previewAnswers[index] as string[])
                                    : [];
                                  if (q.allowMultipleAnswers) {
                                    if (e.target.checked) {
                                      handleAnswerChange(index, [
                                        ...selectedOptions,
                                        option,
                                      ]);
                                    } else {
                                      handleAnswerChange(
                                        index,
                                        selectedOptions.filter(
                                          (opt) => opt !== option
                                        )
                                      );
                                    }
                                  } else {
                                    // Single answer mode: Only allow one selected option
                                    handleAnswerChange(
                                      index,
                                      e.target.checked ? [option] : []
                                    );
                                  }
                                }}
                                className="border-gray-300 focus:ring-blue-500 h-4 w-4"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : q.inputType === "dropdown" ? (
                        // handling for dropdown input
                        <div className="mt-2">
                          <select
                            onChange={(e) =>
                              handleAnswerChange(index, e.target.value)
                            }
                            className="border p-2 rounded w-full"
                          >
                            <option value="">Vælg et svar</option>
                            {q.options?.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                      ) : q.inputType === "calendar" ? (
                        // handling for calendar input
                        <div className="mt-2">
                          <input
                            type="date"
                            onChange={(e) =>
                              handleAnswerChange(index, e.target.value)
                            }
                            className="border p-2 rounded w-full"
                          />
                        </div>
                              ) : q.inputType === "tekst-block" ? (
                                // Handling for tekst-block
                                <>
                                  <p className="font-bold">{q.text}</p> {/* Titel */}
                                  <p className="italic">
                                    {q.body || "Ingen brødtekst tilgængelig"}
                                  </p> {/* Brødtekst */}
                                </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600"
              >
                {isPreview ? "Deaktiver Preview Mode" : "Aktiver Preview Mode"}
              </button>
            </div>

            {isPreview && (
              <div>
                {/* Navigation Buttons */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPageIndex === 0}
                    className={`bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 ${
                      currentPageIndex === 0 && "cursor-not-allowed opacity-50"
                    }`}
                  >
                    Tilbage
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex === flow.pages.length - 1}
                    className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                      currentPageIndex === flow.pages.length - 1 &&
                      "cursor-not-allowed opacity-50"
                    }`}
                  >
                    Næste
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {isPlayMode && (
        <div className="p-6 w-full">
          <button
            onClick={() => setIsPlayMode(false)}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Afslut Play Mode
          </button>
          <PlayMode flow={flow} onExit={() => setIsPlayMode(false)} />
        </div>
      )}
    </div>
  );
}
