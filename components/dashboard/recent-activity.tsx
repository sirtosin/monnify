// "use client"

// import { useSelector } from "react-redux"
// import { motion, AnimatePresence } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   formatCurrency,
//   formatRelativeTime,
//   getStatusColor,
// } from "@/lib/utils/formatters"
// import type { RootState } from "@/lib/store"

// export function RecentActivity() {
//   const { metrics } = useSelector((state: RootState) => state.dashboard)

//   if (!metrics?.recent_matches?.length) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground text-center py-8">
//             No recent reconciliation activity
//           </p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
//         <p className="text-xs text-muted-foreground">Latest settlement signals</p>
//       </CardHeader>
//       <CardContent className="p-0">
//         <ScrollArea className="h-[280px]">
//           <AnimatePresence>
//             {metrics.recent_matches.map((match, index) => (
//               <motion.div
//                 key={match.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
//               >
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium truncate max-w-[200px]">
//                       {match.payment_reference}
//                     </span>
//                     <Badge variant="outline" className={getStatusColor(match.status)}>
//                       {match.status.replace("_", " ")}
//                     </Badge>
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     {match.transaction_reference}
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm font-medium">
//                     {formatCurrency(match.expected_amount)}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     {formatRelativeTime(match.created_at)}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }
