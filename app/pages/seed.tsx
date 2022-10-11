/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
const Button = ({ task }) => (
  <div className="mb-5 flex-1">
    <button
      type="button"
      className="color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker mt-5 mr-8 rounded-full border px-8 py-2 font-bold"
      onClick={async () => {
        await fetch("/api/seed", {
          body: JSON.stringify({
            task: task.task,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      }}
    >
      {task.description}
    </button>
  </div>
);

export default function Seed() {
  const tasks = [
    {
      task: "add_fake_bookings",
      description: "add fake bookings",
    },
    {
      task: "add_fake_reviews",
      description: "add fake reviews",
    },

    {
      task: "clean_database",
      description: "clean the database",
    },
  ];

  return (
    <div className="mt-10 ml-20">
      <h2 className="mb-10 text-xl">Utils</h2>

      {tasks.map((task, index) => (
        <Button key={index} task={task} />
      ))}
    </div>
  );
}
