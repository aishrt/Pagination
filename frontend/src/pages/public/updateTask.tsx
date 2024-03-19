import axios from "axios";
import { useEffect, useState } from "react";
import storage from "../../utils/storage";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import taskImg from "../../assets/blog.jpg";
import BackdropLoader from "../../components/Loader/BackdropLoader";
import "./protected.css";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../layout/ContentLayout";
import { API_URL } from "../../config";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

function UpdateTask() {
  const token = storage.getToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [task, setTask] = useState<any>(null);

  const getTask = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/task/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTask(response?.data?.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      } else {
        console.log("An error occurred");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getTask();
    }
  }, [id]);

  interface FormData {
    title: string;
    author: string;
    content: string;
    dueDate: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put(`${API_URL}/task/update/${task?._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Data updated successfully!");
      navigate("/task-list");
    } catch (error) {
      console.error("Error:", error);

      toast.error(`${error}`);
    }
  };

  return (
    <ContentLayout title="Edit User">
      <BackdropLoader open={isLoading} />
      {!task ? (
        <BackdropLoader open={true} />
      ) : (
        <>
          <div className="formDiv">
            <div className="">
              <div
                className="row backButton"
                onClick={() => navigate("/task-list")}
              >
                <i className="fa-solid fa-circle-left"></i>
              </div>
              <div className="row">
                <div className="col-md-7 make-center">
                  <div className="imgDiv">
                    <img className="blImg" src={taskImg} />
                  </div>
                </div>
                <div className="col-md-5 make-center">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        id="title"
                        {...register("title", { required: true })}
                        label="Title"
                        variant="filled"
                        defaultValue={task?.title}
                      />

                      {errors.title && (
                        <p className="errorText">Title is required.</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        id="author"
                        label="Author"
                        defaultValue={task?.author}
                        variant="filled"
                        {...register("author", {
                          required: "Author name is required",
                          maxLength: {
                            value: 20,
                            message: "Author name cannot exceed 20 characters",
                          },
                          minLength: {
                            value: 1,
                            message: "Author name is required",
                          },
                        })}
                      />

                      {errors.author && (
                        <p className="errorText">{errors.author.message}</p>
                      )}
                    </div>
                    <div>
                      <TextField
                        id="dueDate"
                        defaultValue={task?.dueDate}
                        variant="filled"
                        type="date"
                        {...register("dueDate", {
                          required: "Due Date is required",
                          minLength: {
                            value: 1,
                            message: "Due Date is required",
                          },
                        })}
                      />

                      {errors.author && (
                        <p className="errorText">{errors.author.message}</p>
                      )}
                    </div>
                    <div className="mt-3">
                      <TextareaAutosize
                        aria-label="minimum height"
                        defaultValue={task?.content}
                        className="textAr"
                        minRows={3}
                        placeholder="Content"
                        {...register("content", { required: true })}
                      />

                      {errors.content && (
                        <p className="errorText">Content is required.</p>
                      )}
                    </div>

                    <div className="make-center mt-5">
                      <Button variant="contained" type="submit">
                        Edit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ContentLayout>
  );
}

export default UpdateTask;
