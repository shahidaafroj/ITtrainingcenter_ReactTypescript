import React, { useEffect, useState } from "react";
import { getAdmissions, deleteAdmission } from '../../utilities/services';


const AdmissionList = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    const res = await getAdmissions();
    setAdmissions(res.data);
  };

interface AdmissionDetail {
    // Add fields as needed, using 'any' if unknown
    [key: string]: any;
}

interface Admission {
    admissionId: number;
    admissionNo: string;
    visitorId: number;
    organizationName: string;
    admissionDate: string;
    admissionDetails?: AdmissionDetail[];
}

const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure to delete?")) {
        await deleteAdmission(id);
        loadAdmissions();
    }
};

  return (
    <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h3>All Admissions</h3>
    <button
      className="btn btn-primary"
      onClick={() => window.location.href = "/create-admission"}
    >
      + Add Admission
    </button>
  </div>

  <table className="table table-striped table-bordered shadow-sm">
    <thead className="table-dark">
      <tr>
        <th>Admission No</th>
        <th>Visitor ID</th>
        <th>Organization</th>
        <th>Date</th>
        <th>Details</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {admissions.map((a) => (
        <tr key={a.admissionId}>
          <td>{a.admissionNo}</td>
          <td>{a.visitorId}</td>
          <td>{a.organizationName}</td>
          <td>{new Date(a.admissionDate).toLocaleDateString()}</td>
          <td>{a.admissionDetails?.length || 0}</td>
          <td>
              <button
    className="btn btn-sm btn-info me-2"
    onClick={() => window.location.href = `/edit-admission/${a.admissionId}`}
  >
    Edit
  </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(a.admissionId)}
            >
              Delete
            </button>
            <button
              onClick={() => window.location.href = `/admission-details/${a.admissionId}`}
            >
              Details
</button>

          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default AdmissionList;
