import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Button } from "@mui/material";
import taskImg from "../../assets/blog.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ContentLayout } from "../../layout/ContentLayout";
import { API_URL } from "../../config";
import storage from "../../utils/storage";
import "./protected.css";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import styled from "@emotion/styled";
import UploadFile from "../../components/Ui/UploadFile";
import { useState } from "react";
import { fileUpload } from "../api/fileUpload";

interface FormData {
  title: string;
  author: string;
  content: string;
  logo: string;
}
const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px; 
  color: grey;
  background: #e9e8e8;
  border: 1px solid #e9e8e8 
`
);
export const CreateTask = () => {
  const navigate = useNavigate();
  const token = storage.getToken();

  const [file, setFile] = useState<any>();

  const handleFileUpload = (fileDetails: any) => {
    if (fileDetails?.fileName && fileDetails?.file == null) {
      // Don't do anything in this case; it means we have not changed the image
      console.log("Initial File Details:", fileDetails);
      return;
    } else {
      console.log("Selected File Details:", fileDetails?.file);
      setFile(fileDetails.file);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      let uploadedFile: any = "";

      if (file) {
        const imgResp = await fileUpload(file);
        uploadedFile = imgResp;
      }

      data.logo = uploadedFile;

      const result = await axios.post(`${API_URL}/task/add`, data);

      toast.success(`${result.data.message}`);
      navigate("/task-list");
    } catch (error: any) {
      toast.error(`${error?.response?.data?.message}`);
    }
  };

  return (
    <ContentLayout title="Create Tasks">
      <div className="formDiv">
        <div className="registerMargin">
          <div className="row">
            <div className="col-md-7 make-center">
              <div className="imgDiv">
                <img className="taskImg" src={taskImg} alt="register" />
              </div>
            </div>
            <div className="col-md-5 make-center">
              <h5>Create Task</h5>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
              >
                <div>
                  <UploadFile
                    label="Upload a file"
                    width={110}
                    onFileUpload={handleFileUpload}
                    showFileName={false}
                  />
                </div>{" "}
                <div>
                  <TextField
                    id="title"
                    {...register("title", { required: true })}
                    label="Title"
                    variant="filled"
                  />

                  {errors.title && (
                    <p className="errorText">Title is required.</p>
                  )}
                </div>
                <div>
                  <TextField
                    id="author"
                    label="Author"
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
                <div className="mt-3">
                  <Textarea
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Content"
                    {...register("content", { required: true })}
                  />

                  {errors.content && (
                    <p className="errorText">Content is required.</p>
                  )}
                </div>
                <div className="make-center">
                  <Button
                    className={clsx("mt-4")}
                    variant="contained"
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};
