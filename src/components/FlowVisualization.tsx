"use client";

import React, { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

type Question = {
  text: string;
  inputType: string;
};

type PostCondition = {
  condition: {
    questionIndex: number;
    value: string | number;
    operator?: string;
  };
  nextPageId: string;
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
  postConditions?: PostCondition[];
};

type FlowVisualizationProps = {
  flow: {
    pages: Page[];
  };
  onSwitchPage: (pageIndex: number) => void;
  onDeletePage: (pageId: string) => void;
};

const LOCAL_STORAGE_KEY_NODES = "flow-visualization-nodes";

export default function FlowVisualization({ flow, onSwitchPage, onDeletePage }: FlowVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!flow?.pages) return;

    const savedNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || "[]");

    const initialNodes: Node[] = flow.pages.map((page, pageIndex) => {
      const savedNode = savedNodes.find((node: Node) => node.id === `page-${page.id}`);
      const lastNodePosition =
        savedNodes[savedNodes.length - 1]?.position || { x: (pageIndex - 1) * 300, y: 50 };

      return {
        id: `page-${page.id}`,
        type: "default",
        position:
          savedNode?.position ||
          (pageIndex === flow.pages.length - 1
            ? { x: lastNodePosition.x + 200, y: lastNodePosition.y + 100 }
            : { x: pageIndex * 300, y: 50 }),
        data: {
          label: (
            <div style={{ color: "#FFFFFF", cursor: "pointer", position: "relative" }}>
              <button
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  textAlign: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmation = window.confirm(
                    `Er du sikker på du vil slette: "${page.name}"?`
                  );
                  if (confirmation) {
                    onDeletePage(page.id);
                  }
                }}
              >
                ×
              </button>
              <h3>{page.name}</h3>
              <ul>
                {page.questions.map((q, qIndex) => (
                  <li key={`q-${qIndex}`}>
                    {q.text} ({q.inputType})
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        style: {
          backgroundColor: "#006E64",
          border: "1px solid #000",
          borderRadius: 5,
        },
      };
    });

    const postConditionEdges: Edge[] = flow.pages.flatMap((page) =>
      page.postConditions?.map((condition, index) => {
        const targetPage = flow.pages.find((p) => p.id === condition.nextPageId);
        if (targetPage) {
          const operator = condition.condition.operator || "="; // Default to "=" if no operator
          return {
            id: `post-edge-${page.id}-${index}`,
            source: `page-${page.id}`,
            target: `page-${targetPage.id}`,
            label: `Hvis spørgsmål ${condition.condition.questionIndex + 1} ${operator} "${condition.condition.value}"`,
            labelStyle: { fill: "#FFA032", fontWeight: "bold" },
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#FFA032",
            },
            style: { stroke: "#FFA032", strokeWidth: 2 },
          };
        }
        return null;
      }) || []
    ).filter((edge) => edge !== null);

    const initialEdges = [...postConditionEdges];

    setNodes(initialNodes);
    setEdges(initialEdges as Edge[]);
  }, [flow]);

  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);
    const updatedNodes = nodes.map((node) => ({
      ...node,
      position: changes.find((change: any) => change.id === node.id)?.position || node.position,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(updatedNodes));
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const pageIndex = flow.pages.findIndex((page) => `page-${page.id}` === node.id);
    if (pageIndex !== -1) {
      onSwitchPage(pageIndex);
    }
  };

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        style={{ backgroundColor: "#ffffff" }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}


