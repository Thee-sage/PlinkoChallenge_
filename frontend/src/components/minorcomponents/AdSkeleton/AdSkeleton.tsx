import styles from './AdSkeleton.module.css';

interface AdSkeletonProps {
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
}

export const AdSkeleton = ({ width = 280, height = 450, count = 1, className }: AdSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${className ?? ''}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};
