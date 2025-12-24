import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import { blog_comments_data } from "../../../core/data/json/blog_comments_data";
import Table from "../../../core/common/dataTable/index";
import { all_routes } from "../../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";

type BlogCommentRow = {
  key: string;
  comment: string;
  date: string;
  blog: string;
  by: string;
};

const BlogComments = () => {
  const data = blog_comments_data;
  const routes = all_routes;
  const columns = [
    {
      title: "Comment",
      dataIndex: "comment",
      sorter: (a: BlogCommentRow, b: BlogCommentRow) =>
        a.comment.length - b.comment.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: BlogCommentRow, b: BlogCommentRow) =>
        a.date.length - b.date.length,
    },

    {
      title: "Blog",
      dataIndex: "blog",
      sorter: (a: BlogCommentRow, b: BlogCommentRow) =>
        a.blog.length - b.blog.length,
    },
    {
      title: "By",
      dataIndex: "by",
      sorter: (a: BlogCommentRow, b: BlogCommentRow) =>
        a.by.length - b.by.length,
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
        
          {/* /Breadcrumb */}
       
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014 - 2025 © SmartHR.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Dreams
            </Link>
          </p>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default BlogComments;
