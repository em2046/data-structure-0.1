<template>
  <h1>Home</h1>
  <svg viewBox="0 0 1 1">
    <circle
      v-for="point in points"
      :key="point.id"
      :r="settings.size"
      :cx="point.x"
      :cy="point.y"
    ></circle>
    <line
      v-for="segment in segments"
      :key="segment.id"
      :x1="segment.start.x"
      :x2="segment.end.x"
      :y1="segment.start.y"
      :y2="segment.end.y"
      stroke-width="0.005"
      stroke="black"
    ></line>
  </svg>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { pointsData } from "../data/points-data";
import { Point2d, Segment2d } from "../../geometry";

export default defineComponent({
  name: "Home",
  setup() {
    let points = ref<Point2d[]>(pointsData);
    let segmentsData = pointsData.filter((point, index) => {
      return index % 5 === 0;
    });
    let segmentList: Segment2d = [];

    for (let i = 0; i < segmentsData.length / 2; i++) {
      let start = segmentsData[i * 2];
      let end = segmentsData[i * 2 + 1];

      segmentList.push({
        start: start,
        end: end,
        key: `${start.id}x${end.id}`,
      });
    }

    let segments = ref<Segment2d[]>(segmentList);
    let settings = reactive({
      size: 0.005,
    });

    return {
      points,
      segments,
      settings,
    };
  },
});
</script>
