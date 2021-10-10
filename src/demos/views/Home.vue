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
      :x1="segment.from.x"
      :x2="segment.to.x"
      :y1="segment.from.y"
      :y2="segment.to.y"
      opacity="0.5"
      stroke="gray"
    ></line>
  </svg>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { LineSegment2d, Point2d } from "../../geometry";
import { getSegmentList } from "../../data/segment-list";
import sweep from "../../isect/sweep";

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

    function getIntersection(segmentList) {
      let result = sweep(segmentList).run();

      return result?.map((item) => {
        return item.point;
      });
    }

    const points = ref<Point2d[]>(getIntersection(segmentList));

    function handleStepChange() {
      const newSegmentList = getSegmentList(step.value);

      segments.value = newSegmentList;
      points.value = getIntersection(newSegmentList);
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
