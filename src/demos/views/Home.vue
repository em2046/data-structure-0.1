<template>
  <h1>Home</h1>
  <input
    v-model="step"
    max="10"
    min="2"
    type="number"
    @change="handleStepChange"
  />
  <svg viewBox="0 0 1 1">
    <circle
      v-for="point in points"
      :key="point.id"
      :cx="point.x"
      :cy="point.y"
      :r="settings.size"
      fill="orange"
      opacity="0.5"
    ></circle>
    <line
      v-for="segment in segments"
      :key="segment.id"
      :stroke-width="settings.lineWidth"
      :x1="segment.start.x"
      :x2="segment.end.x"
      :y1="segment.start.y"
      :y2="segment.end.y"
      opacity="0.5"
      stroke="gray"
    ></line>
  </svg>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { LineSegment2d, planeSweep, Point2d } from "../../geometry";
import { getSegmentList } from "../../data/segment-list";

export default defineComponent({
  name: "Home",
  setup() {
    const step = ref(5);
    const segmentList = getSegmentList(step.value);
    const segments = ref<LineSegment2d[]>(segmentList);
    const settings = reactive({
      lineWidth: 0.001,
      size: 0.002,
    });
    const intersections = planeSweep(segmentList);
    const points = ref<Point2d[]>(intersections);

    function handleStepChange() {
      const newSegmentList = getSegmentList(step.value);

      segments.value = newSegmentList;
      points.value = planeSweep(newSegmentList);
    }

    return {
      step,
      points,
      segments,
      settings,
      handleStepChange,
    };
  },
});
</script>
