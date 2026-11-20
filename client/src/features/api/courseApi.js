

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture", "Lecture", "Course"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getSearchCourse: builder.query({
            query: ({ searchQuery, categories, levels, price, minPrice, maxPrice, sortBy }) => {
                const params = new URLSearchParams();
                params.set("query", searchQuery || "");
                if (categories?.length) params.set("categories", categories.join(","));
                if (levels?.length) params.set("levels", levels.join(","));
                if (price) params.set("price", price);
                if (minPrice !== "" && minPrice != null) params.set("minPrice", minPrice);
                if (maxPrice !== "" && maxPrice != null) params.set("maxPrice", maxPrice);
                if (sortBy) params.set("sortBy", sortBy);

                return {
                    url: `/search?${params.toString()}`,
                    method: "GET",
                }
            }
        }),
        getPublishedCourse: builder.query({
            query: () => ({
                url: "/published-courses",
                method: "GET",
            }),
        }),

        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course']

        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: (r, e, { courseId }) => ['Refetch_Creator_Course', { type: "Course", id: courseId }]
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",
            }),
            providesTags: (r, e, courseId) => [{ type: "Course", id: courseId }],
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle },
            }),
            // New lecture changes the course's lecture count (Publish button)
            invalidatesTags: (r, e, { courseId }) => ["Refetch_Lecture", { type: "Course", id: courseId }],
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ['Refetch_Lecture']
        }),
        editLecture: builder.mutation({
            query: ({
                lectureTitle,
                videoInfo,
                isPreviewFree,
                courseId,
                lectureId,
            }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree },
            }),
            // Refresh this lecture and the lecture list after saving
            invalidatesTags: (result, error, { lectureId, courseId }) => [
                { type: "Lecture", id: lectureId },
                "Refetch_Lecture",
                { type: "Course", id: courseId },
            ],
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture", "Course"],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET",
            }),
            providesTags: (result, error, lectureId) => [{ type: "Lecture", id: lectureId }],
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH",
            }),
            invalidatesTags: (r, e, { courseId }) => ["Refetch_Creator_Course", { type: "Course", id: courseId }],
        }),
        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Refetch_Creator_Course'], // optional if you want to refetch list
        }),

    }),
});

export const { useCreateCourseMutation,useGetSearchCourseQuery, useGetCreatorCourseQuery, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetCourseLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishCourseMutation, useDeleteCourseMutation, useGetPublishedCourseQuery } = courseApi;