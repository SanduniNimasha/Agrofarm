// Card.jsx - Updated with individual PDF generation
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { axiosDelete } from "../../../axiosServices";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  employeeInfo: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  jobRole: {
    fontSize: 16,
    color: "#0066cc",
    marginTop: 10,
    textAlign: "center",
    border: "1px solid #ccc",
    padding: 8,
    borderRadius: 4,
  },
});

// Define Employee PDF Document component
const EmployeePDFDocument = ({ empData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Customer Report</Text>
      <View style={styles.section}>
        <View style={styles.employeeInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{empData.firstname} {empData.lastname}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{empData.email}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.label}>Position:</Text>
          <Text style={styles.value}>{empData.job}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{empData._id}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const Card = ({ empData, handleEdit, handleReRender }) => {
  const { firstname, lastname, job, email, image } = empData;
  const [dropDown, setDropdown] = useState(false);

  const handleDelete = async (id) => {
    try {
      const res = await axiosDelete(`/employee/${id}`);
      console.log(res);
      handleReRender();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card-component">
      <div className="card-inner">
        <div className="dropdownContainer">
          <BsThreeDotsVertical size={20} onClick={() => setDropdown(!dropDown)} />
          {dropDown && (
            <ul
              className="dropdown"
              onMouseLeave={() => setDropdown(false)}
            >
              <li onClick={() => handleEdit(empData._id)}>Edit</li>
              <li onClick={() => handleDelete(empData._id)}>Delete</li>
              
            </ul>
          )}
        </div>
        <div className="profileImage">
          <img src={image} alt={firstname} />
        </div>
        <div className="emp-detail">
          <h3>{firstname} {lastname}</h3>
          <p>{email}</p>
        </div>
        <div className="pdf-button">
          <PDFDownloadLink
            document={<EmployeePDFDocument empData={empData} />}
            fileName={`${firstname}-${lastname}-report.pdf`}
            className="pdf-icon-link"
          >
            {({ blob, url, loading, error }) => (
              <FaFilePdf
                size={20}
                color="#dc3545"
                title="Download Customer Report"
                className={loading ? "pdf-icon loading" : "pdf-icon"}
              />
            )}
          </PDFDownloadLink>
        </div>
      </div>
      <div className="job-role">
        <p>{job}</p>
      </div>
    </div>
  );
};

export default Card;