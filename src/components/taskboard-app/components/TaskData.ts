export type Task = {
  title: String,
  category: TaskCategory
  status: TaskStatus,
  body: String,
  attachment: URL
}

enum TaskStatus {
  new,
  seen,
  inProgress,
  completed
}

enum TaskCategory {

}