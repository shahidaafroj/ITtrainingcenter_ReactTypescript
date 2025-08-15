import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VisitorTransferService } from "../../utilities/services/visitorTransferService";

export const VisitorTransferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [transfer, setTransfer] = useState<any>(null);

  useEffect(() => {
    if (id) loadTransfer(parseInt(id));
  }, [id]);

  const loadTransfer = async (id: number) => {
    const data = await VisitorTransferService.getTransferById(id);
    setTransfer(data);
  };

  if (!transfer) return <p>Loading...</p>;

  return (
    <div>
      <h3>Visitor Transfer Details</h3>
      <p>Visitor Name: {transfer.visitorName}</p>
      <p>Employee Name: {transfer.employeeName}</p>
      <p>Transfer Date: {transfer.transferDate}</p>
      <p>Notes: {transfer.notes}</p>
      <p>User Name: {transfer.userName}</p>
    </div>
  );
};