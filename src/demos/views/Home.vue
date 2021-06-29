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
      :stroke-width="settings.size"
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
import { pointsRaw } from "../data/points-raw";
import { Point2d, Segment2d } from "../../geometry";

const point2dList = pointsRaw.map((point) => {
  return new Point2d(point.x, point.y, point.id);
});
const segmentsRaw = pointsRaw.filter((_, index) => {
  return index % 5 === 0;
});
const segment2dList: Segment2d[] = [];

for (let i = 0; i < segmentsRaw.length / 2; i++) {
  const start = segmentsRaw[i * 2];
  const end = segmentsRaw[i * 2 + 1];

  segment2dList.push(new Segment2d(start, end, `${start.id}-${end.id}`));
}

export default defineComponent({
  name: "Home",
  setup() {
    const points = ref<Point2d[]>(point2dList);
    const segments = ref<Segment2d[]>(segment2dList);
    const settings = reactive({
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
