import { Course } from "./course";

export interface Day {
    date: Date,
    humanDate: string,
    courses: Course[],
}
