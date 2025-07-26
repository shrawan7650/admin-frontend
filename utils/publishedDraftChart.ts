// import { BlogPost } from "@/lib/ai-blog-generator";
// import { startOfWeek, format, addDays } from "date-fns";

// export function groupPostsByWeek(posts: BlogPost[]) {
//   const weeklyMap = new Map<string, { weekStart: string; Draft: number; Published: number }>();
// console.log("weeklyMap",weeklyMap)
//   posts.forEach((post) => {
//     const createdDate = new Date(post.createdAt);
//     const weekStartDate = startOfWeek(createdDate, { weekStartsOn: 1 }); // Monday as week start
//     const key = format(weekStartDate, "yyyy-MM-dd");

//     if (!weeklyMap.has(key)) {
//       weeklyMap.set(key, {
//         weekStart: key,
//         Draft: 0,
//         Published: 0,
//       });
//     }

//     const weekData = weeklyMap.get(key)!;
//     if (post.status === "Draft") weekData.Draft += 1;
//     else if (post.status === "Published") weekData.Published += 1;
//   });

//   // Sort by weekStart
//   return Array.from(weeklyMap.values()).sort(
//     (a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
//   );
// }
