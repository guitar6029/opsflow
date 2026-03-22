export const STATUSES = ['open', 'in_progress', 'closed'] as const;
export type Status = (typeof STATUSES)[number];
export type Task = {
  id: number;
  title: string;
  status: Status;
};
