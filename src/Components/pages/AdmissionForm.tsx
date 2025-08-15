import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAdmission, updateAdmission, VisitorService } from "../../utilities/services";
import { OfferService } from "../../utilities/services";
import { RegistrationService } from "../../utilities/services";
import { BatchService } from "../../utilities/services/batchService";
import { IBatch, IOffer, IVisitor } from "../../interfaces";
import { createAdmission } from "../../utilities/services";
import { IRegistration } from "../../interfaces/IRegistration";
import axios from "axios";
// Import or define your API base URL here
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5281/api/Admission";

type AdmissionDetail = { registrationId: number; batchId: number };

type AdmissionFormState = {
  visitorId: number;
  offerId: number;
  organizationName: string;
  discountAmount: number;
  admissionDate: string;
  remarks: string;
  admissionDetails: AdmissionDetail[];
};

const AdmissionForm = () => {
  const [form, setForm] = useState<AdmissionFormState>({
    visitorId: 0,
    offerId: 0,
    organizationName: '',
    discountAmount: 0,
    admissionDate: '',
    remarks: '',
    admissionDetails: []
  });

  const [visitors, setVisitors] = useState<IVisitor[]>([]);
const [offers, setOffers] = useState<IOffer[]>([]);
const [registrations, setRegistrations] = useState<IRegistration[]>([]);
const [batches, setBatches] = useState<IBatch[]>([]);

const [detail, setDetail] = useState<AdmissionDetail>({ registrationId: 0, batchId: 0 });

useEffect(() => {
  const loadData = async () => {
    try {
      const [vData, oData, rData, bData] = await Promise.all([
        VisitorService.getAll(),
        OfferService.getAll(),
        RegistrationService.getAll(),
        BatchService.getAll()
      ]);
      setVisitors(vData);
      setOffers(oData);
      setRegistrations(rData);
      setBatches(bData);
    } catch (err) {
      console.error("Dropdown data loading failed", err);
    }
  };
  loadData();
}, []);


  const handleAddDetail = () => {
    setForm({ ...form, admissionDetails: [...form.admissionDetails, detail] });
    setDetail({ registrationId: 0, batchId: 0 });
  };

const navigate = useNavigate();



// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
  
//   try {
//     if (isEdit) {
//       await updateAdmission(Number(id), form); // Update existing admission
//       alert("Admission updated!");
//     } else {
//       await createAdmission(form); // Create new admission
//       alert("Admission created!");
//     }

//     navigate("/admissions"); // ⬅️ Redirect to list after save

//   } catch (err) {
//     console.error("Error submitting admission:", err);
//     alert("Failed to save admission.");
//   }
// };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // 1. Prepare payload
    const payload = {
      ...form,
      admissionId: isEdit ? Number(id) : undefined, // Ensure ID matches route
      admissionDate: new Date(form.admissionDate).toISOString(),
      offerId: form.offerId || null,
      discountAmount: form.discountAmount || null,
      admissionDetails: form.admissionDetails.map(detail => ({
        registrationId: detail.registrationId,
        batchId: detail.batchId
      }))
    };

    // 2. Add auth headers if needed
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    };

    // 3. Make API call
    if (isEdit && id) {
      await axios.put(`${API_URL}/UpdateAdmission/${id}`, payload, config);
      alert('Admission updated successfully!');
    } else {
      await axios.post(`${API_URL}/InsertAdmission`, payload, config);
      alert('Admission created successfully!');
    }

    navigate('/admissions');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Submission error:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } else if (error instanceof Error) {
      console.error('Submission error:', error.message);
      alert(`Error: ${error.message}`);
    } else {
      console.error('Submission error:', error);
      alert('An unknown error occurred.');
    }
  }
};



const { id } = useParams(); // Admission ID if editing
const isEdit = !!id;

useEffect(() => {
  const loadData = async () => {
    try {
      const [vData, oData, rData, bData] = await Promise.all([
        VisitorService.getAll(),
        OfferService.getAll(),
        RegistrationService.getAll(),
        BatchService.getAll()
      ]);
      setVisitors(vData);
      setOffers(oData);
      setRegistrations(rData);
      setBatches(bData);

      // 👉 If editing, load admission by ID
      if (isEdit) {
        const admissionRes = await getAdmission(Number(id)); // ⬅️ you need this service
        const a = admissionRes.data;
        setForm({
          visitorId: a.visitorId,
          offerId: a.offerId,
          organizationName: a.organizationName,
          discountAmount: a.discountAmount,
          admissionDate: a.admissionDate?.substring(0, 10), // trim time if needed
          remarks: a.remarks,
          admissionDetails: a.admissionDetails || []
        });
      }

    } catch (err) {
      console.error("Dropdown data loading failed", err);
    }
  };

  loadData();
}, [id]);




  return (
    <div className="container mt-4">
      <h3>Create Admission</h3>
      <form onSubmit={handleSubmit} className="p-4 bg-light shadow-sm rounded">

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Visitor</label>
            <select className="form-select" value={form.visitorId} onChange={e => setForm({ ...form, visitorId: Number(e.target.value) })}>
              <option value="0">-- Select Visitor --</option>
              {visitors.map(v => <option key={v.visitorId} value={v.visitorId}>{v.visitorName}</option>)}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Offer</label>
            <select className="form-select" value={form.offerId} onChange={e => setForm({ ...form, offerId: Number(e.target.value) })}>
              <option value="0">-- Select Offer --</option>
              {offers.map(o => <option key={o.offerId} value={o.offerId}>{o.offerName}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Organization</label>
          <input className="form-control" value={form.organizationName} onChange={e => setForm({ ...form, organizationName: e.target.value })} />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Admission Date</label>
            <input type="date" className="form-control" value={form.admissionDate} onChange={e => setForm({ ...form, admissionDate: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Discount</label>
            <input type="number" className="form-control" value={form.discountAmount} onChange={e => setForm({ ...form, discountAmount: Number(e.target.value) })} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Remarks</label>
          <textarea className="form-control" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
        </div>

        <hr />
        <h5>Add Trainee Details</h5>

        <div className="row mb-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Registration</label>
            <select className="form-select" value={detail.registrationId} onChange={e => setDetail({ ...detail, registrationId: Number(e.target.value) })}>
              <option value="0">-- Select Registration --</option>
              {registrations.map(r => <option key={r.registrationId} value={r.registrationId}>{r.traineeName}</option>)}
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Batch</label>
            <select className="form-select" value={detail.batchId} onChange={e => setDetail({ ...detail, batchId: Number(e.target.value) })}>
              <option value="0">-- Select Batch --</option>
              {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchName}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={handleAddDetail}>Add</button>
          </div>
        </div>

       <ul className="list-group mb-3">
  {form.admissionDetails.map((d, i) => {
    // Find matching registration and batch names by their IDs
    const reg = registrations.find(r => r.registrationId === d.registrationId);
    const batch = batches.find(b => b.batchId === d.batchId);

    return (
      <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
        <div>
          Registration: {reg ? reg.traineeName : 'Unknown'}, Batch: {batch ? batch.batchName : 'Unknown'}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => {
            // Remove the detail at index i
            setForm(prev => ({
              ...prev,
              admissionDetails: prev.admissionDetails.filter((_, idx) => idx !== i)
            }));
          }}
        >
          Remove
        </button>
      </li>
    );
  })}
</ul>


        <button type="submit" className="btn btn-success">Submit Admission</button>
      </form>
    </div>
  );
};

export default AdmissionForm;
