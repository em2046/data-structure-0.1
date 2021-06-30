<template>
  <h1>Home</h1>
  <svg viewBox="0 0 1 1">
    <circle
      v-for="point in points"
      :key="point.id"
      :cx="point.x"
      :cy="point.y"
      :r="settings.size"
    ></circle>
    <line
      v-for="segment in segments"
      :key="segment.id"
      :stroke-width="settings.lineWidth"
      :x1="segment.start.x"
      :x2="segment.end.x"
      :y1="segment.start.y"
      :y2="segment.end.y"
      stroke="black"
    ></line>
  </svg>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { planeSweep, Point2d, Segment2d } from "../../geometry";
import { segmentList } from "../../data/segment-list";

export default defineComponent({
  name: "Home",
  setup() {
    const segments = ref<Segment2d[]>(segmentList);
    const settings = reactive({
      lineWidth: 0.001,
      size: 0.002,
    });
    const intersections = planeSweep(segmentList);
    const points = ref<Point2d[]>(intersections);

    return {
      points,
      segments,
      settings,
    };
  },
});
</script>
