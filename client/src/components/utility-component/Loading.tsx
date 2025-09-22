import { motion } from "framer-motion";
type LoadingProps = {
  message?: string;
};
export default function Loading({ message }: LoadingProps) {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh] text-olive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-olive border-t-transparent"></div>
        <span className="text-lg font-medium">{message}</span>
      </div>
    </motion.div>
  );
}
