<template>
  <div class="sankey-chart">
    <svg :width="width" :height="height">
      <!-- Render links -->
      <path
        v-for="(link, index) in sankeyLinks"
        :key="'link-' + index"
        :d="generatePath(link)"
        fill="none"
        stroke="steelblue"
        :stroke-width="link.width"
        opacity="0.7"
      ></path>

      <!-- Render nodes -->
      <rect
        v-for="(node, index) in sankeyNodes"
        :key="'node-' + index"
        :x="node.x"
        :y="node.y"
        :width="nodeWidth"
        :height="node.height"
        fill="lightblue"
        stroke="darkblue"
      ></rect>

      <!-- Render node labels -->
      <text
        v-for="(node, index) in sankeyNodes"
        :key="'label-' + index"
        :x="node.x + nodeWidth + 5"
        :y="node.y + node.height / 2"
        font-size="12"
        fill="black"
        alignment-baseline="middle"
      >
        {{ node.name }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const width = 800; // SVG width
const height = 400; // SVG height
const nodeWidth = 20; // Width of nodes

// Example data: nodes and links
const data = ref({
  nodes: [
    { id: 'A', name: 'Node A' },
    { id: 'B', name: 'Node B' },
    { id: 'C', name: 'Node C' },
  ],
  links: [
    { source: 'A', target: 'B', value: 50 },
    { source: 'B', target: 'C', value: 30 },
  ],
});

// Scale functions
const yScale = (value, max, totalHeight) => (value / max) * totalHeight;
const xScale = (index, totalNodes, totalWidth) =>
  (index / (totalNodes - 1)) * (totalWidth - nodeWidth);

// Preprocess nodes and links to compute layout
const sankeyNodes = computed(() => {
  const nodes = data.value.nodes.map((node, index) => ({
    ...node,
    x: xScale(index, data.value.nodes.length, width),
    y: 0, // Will adjust later
    height: 0, // Will adjust later
  }));

  // Calculate the total flow for y positioning
  const maxFlow = Math.max(...data.value.links.map(link => link.value));
  const totalHeight = height - 20; // Account for padding

  // Assign heights and y positions based on flow
  let currentY = 10; // Top padding
  nodes.forEach((node, index) => {
    const inflow = data.value.links
      .filter(link => link.target === node.id)
      .reduce((sum, link) => sum + link.value, 0);

    const outflow = data.value.links
      .filter(link => link.source === node.id)
      .reduce((sum, link) => sum + link.value, 0);

    const flow = Math.max(inflow, outflow);
    const nodeHeight = yScale(flow, maxFlow, totalHeight);

    node.height = nodeHeight;
    node.y = currentY;
    currentY += nodeHeight + 10; // Add spacing between nodes
  });

  return nodes;
});

const sankeyLinks = computed(() => {
  const nodesById = Object.fromEntries(
    sankeyNodes.value.map(node => [node.id, node]),
  );

  return data.value.links.map(link => {
    const sourceNode = nodesById[link.source];
    const targetNode = nodesById[link.target];

    const sourceX = sourceNode.x + nodeWidth;
    const sourceY = sourceNode.y + sourceNode.height / 2;
    const targetX = targetNode.x;
    const targetY = targetNode.y + targetNode.height / 2;

    return {
      sourceX,
      sourceY,
      targetX,
      targetY,
      width: Math.sqrt(link.value), // Example: width proportional to value
    };
  });
});

// Function to generate the SVG path for a link
const generatePath = link => {
  const curvature = 0.5;
  const midX = link.sourceX + curvature * (link.targetX - link.sourceX);
  return `M${link.sourceX},${link.sourceY} C${midX},${link.sourceY} ${midX},${link.targetY} ${link.targetX},${link.targetY}`;
};
</script>

<style scoped>
.sankey-chart {
  margin: 1rem auto;
  display: flex;
  justify-content: center;
}
</style>
