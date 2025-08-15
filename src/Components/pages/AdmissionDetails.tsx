import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  
  getAdmission,
  OfferService,
  RegistrationService,
  VisitorService
} from "../../utilities/services";
import {
  IVisitor,
  IOffer,
  
  IBatch,
  Admission
} from "../../interfaces";
import { IRegistration } from "../../interfaces/IRegistration";
import { BatchService } from "../../utilities/services/batchService";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState<Admission | null>(null);
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [offers, setOffers] = useState<IOffer[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [admissionData, regData, batchData, visitorData, offerData] =
          await Promise.all([
            getAdmission(Number(id)),
            RegistrationService.getAll(),
            BatchService.getAll(),
            VisitorService.getAll(),
            OfferService.getAll()
          ]);

        setAdmission(admissionData.data);
        setRegistrations(regData);
        setBatches(batchData);
        setVisitors(visitorData);
        setOffers(offerData);
      } catch (error) {
        console.error("Failed to load admission details", error);
      }
    };

    loadDetails();
  }, [id]);

  if (!admission) return <p>Loading...</p>;

  const getVisitorName = (id: number) =>
    visitors.find((v) => v.visitorId === id)?.visitorName || "";
  const getOfferName = (id: number) =>
    offers.find((o) => o.offerId === id)?.offerName || "";
  const getRegName = (id: number) =>
    registrations.find((r) => r.registrationId === id)?.traineeName || "";
  const getBatchName = (id: number) =>
    batches.find((b) => b.batchId === id)?.batchName || "";

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admission Details</h3>
        <button className="btn btn-secondary" onClick={() => navigate("/admissions")}>
          ← Back to List
        </button>
      </div>

      <div className="bg-light p-4 rounded shadow-sm border">

        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Visitor:</strong> {getVisitorName(admission.visitorId)}
          </div>
          <div className="col-md-6">
            <strong>Offer:</strong>{" "}
            {admission.offerId != null ? getOfferName(admission.offerId) : "N/A"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Organization:</strong> {admission.organizationName}
          </div>
          <div className="col-md-6">
            <strong>Date:</strong>{" "}
            {new Date(admission.admissionDate).toLocaleDateString()}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <strong>Discount:</strong> {admission.discountAmount}
          </div>
          <div className="col-md-6">
            <strong>Remarks:</strong> {admission.remarks}
          </div>
        </div>

        <hr />
        <h5 className="mb-3">Trainee Details</h5>

        <ul className="list-group">
          {admission.admissionDetails?.map((d: any, i: number) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>Registration:</strong> {getRegName(d.registrationId)}<br />
                <strong>Batch:</strong> {getBatchName(d.batchId)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdmissionDetails;
