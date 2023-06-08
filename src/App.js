import React, { useState, useEffect } from 'react';
 import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    // Retrieve tasks from local storage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever it changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle input change in the task input field
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission to add a new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please fill out the task');
      return;
    }

    const taskInEditMode = tasks.find((task) => task.editMode);
    if (taskInEditMode) {
      alert('Please save or cancel the current task edit');
      return;
    }

    setTasks([...tasks, { task: inputValue, completed: false, editMode: false }]);
    setInputValue('');
  };

  // Handle editing a task
  const handleTaskEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].editMode = true;
    setTasks(updatedTasks);
  };

  // Handle saving an edited task
  const handleTaskSave = (index, newTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].task = newTask;
    updatedTasks[index].editMode = false;
    setTasks(updatedTasks);
  };

  // Handle canceling an edit for a task
  const handleTaskCancel = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].editMode = false;
    setTasks(updatedTasks);
  };

  // Handle deleting a task
  const handleTaskDelete = (index) => {
    if (showCompletedTasks) {
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks.splice(index, 1);
      setCompletedTasks(updatedCompletedTasks);
    } else {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    }
  };

  // Handle marking a task as complete
  const handleTaskComplete = (index) => {
    const completedTask = tasks[index];
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);

    setCompletedTasks([...completedTasks, completedTask]);
  };

  // Handle marking a task as incomplete
  const handleTaskIncomplete = (index) => {
    const incompleteTask = completedTasks[index];
    const updatedCompletedTasks = completedTasks.filter((task, i) => i !== index);
    setCompletedTasks(updatedCompletedTasks);

    setTasks([...tasks, incompleteTask]);
  };

  // Toggle display of completed tasks
  const handleToggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  // Handle going back to the tasks list from completed tasks
  const handleBackToTasks = () => {
    setShowCompletedTasks(false);
  };

  // Handle selecting/deselecting a task
  const handleTaskSelection = (index) => {
    const selectedTaskIndex = selectedTasks.indexOf(index);
    if (selectedTaskIndex === -1) {
      setSelectedTasks([...selectedTasks, index]);
    } else {
      const updatedSelectedTasks = [...selectedTasks];
      updatedSelectedTasks.splice(selectedTaskIndex, 1);
      setSelectedTasks(updatedSelectedTasks);
    }
  };

  // Handle deleting selected tasks
  const handleDeleteSelectedTasks = () => {
    const updatedTasks = tasks.filter((_, index) => !selectedTasks.includes(index));
    setTasks(updatedTasks);
    setSelectedTasks([]);
  };

  // Handle marking selected tasks as completed
  const handleMarkSelectedTasksCompleted = () => {
    const updatedTasks = tasks.filter((_, index) => !selectedTasks.includes(index));
    const selectedTasksData = tasks.filter((_, index) => selectedTasks.includes(index));
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, ...selectedTasksData]);
    setSelectedTasks([]);
  };

  return (
    <div className="App">
      <header>
        <h1 className="heading">
          <strong>
            <i className="fa-sharp fa-solid fa-list"></i>
            &nbsp; TO-DO LIST
          </strong>
        </h1>
        <h2 className="headingPlan">Plan</h2>
        <form className="taskAddingBar" onSubmit={handleSubmit}>
          <input
            type="text"
            id="list-input"
            placeholder="Enter Your Task Here!"
            value={inputValue}
            onChange={handleInputChange}
          />
          <input type="submit" id="list-submit" value="ADD" />
        </form>
      </header>
      <main>
        <section className="task-list">
          {!showCompletedTasks && (
            <div>
              <h2 className="headingTasks">
                <i className="fa-sharp fa-solid fa-list-check"></i>
                &nbsp; Tasks
              </h2>
              <div id="tasks">
                {tasks.map((task, index) => (
                  <div className="task" key={index}>
                    <div className="content">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(index)}
                        onChange={() => handleTaskSelection(index)}
                      />
                      {task.editMode ? (
                        <input
                          type="text"
                          className="text"
                          value={task.task}
                          onChange={(e) => {
                            const newTask = e.target.value;
                            const updatedTasks = [...tasks];
                            updatedTasks[index].task = newTask;
                            setTasks(updatedTasks);
                          }}
                        />
                      ) : (
                        <span>{task.task}</span>
                      )}
                    </div>
                    <div className="actions">
                      {task.editMode ? (
                        <div>
                          <button
                            className="save"
                            onClick={() => handleTaskSave(index, task.task)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel"
                            onClick={() => handleTaskCancel(index)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="edit"
                            onClick={() => handleTaskEdit(index)}
                          >
                            Edit
                          </button>
                          {!task.completed && (
                            <button
                              className="delete"
                              onClick={() => handleTaskDelete(index)}
                            >
                              Delete
                            </button>
                          )}
                          {task.completed && (
                            <button
                              className="incomplete"
                              onClick={() => handleTaskIncomplete(index)}
                            >
                              Mark as Incomplete
                            </button>
                          )}
                        </>
                      )}
                      {!task.completed && (
                        <button
                          className="complete"
                          onClick={() => handleTaskComplete(index)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {showCompletedTasks && (
            <div>
              <h2 className="headingCompletedTasks">
                <i className="fa-sharp fa-solid fa-check-circle"></i>
                &nbsp; Completed Tasks
              </h2>
              <div id="completed-tasks">
                {completedTasks.map((task, index) => (
                  <div className="task" key={index}>
                    <div className="content">
                      <input
                        className='check'
                        type="checkbox"
                        checked={selectedTasks.includes(index)}
                        onChange={() => handleTaskSelection(index)}
                      />
                      <span className="completed">{task.task}</span>
                    </div>
                    <div className="actions">
                      <button
                        className="delete"
                        onClick={() => handleTaskDelete(index)}
                      >
                        Delete
                      </button>
                      <button
                        className="incomplete"
                        onClick={() => handleTaskIncomplete(index)}
                      >
                        Mark as Incomplete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="back"
                onClick={handleBackToTasks}
              >
                Back 
              </button>
            </div>
          )}
        </section>
      </main>
      <footer>
        <div className="actions">
          <button
            className="toggle-completed"
            onClick={handleToggleCompletedTasks}
          >
              {showCompletedTasks ? 'Hide Completed Tasks' : 'Completed Tasks'}
          </button>
          {selectedTasks.length > 0 && (
            <div>
              <button
                className="delete-selected"
                onClick={handleDeleteSelectedTasks}
              >
                Delete All
              </button>
              {!showCompletedTasks && (
                <button
                  className="mark-selected-completed"
                  onClick={handleMarkSelectedTasksCompleted}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
