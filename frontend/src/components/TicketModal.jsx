import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketModal({ open, onClose, ticket }) {
    if (!open || !ticket) return null;

    // лучше шифровать только code
    const qrValue = ticket.ticketCode; // или `ticket:${ticket.ticketCode}`

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold">Your Ticket</h2>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600">Event</div>
                    <div className="font-semibold">{ticket.eventTitle}</div>

                    <div className="text-sm text-gray-600 mt-3">Holder</div>
                    <div className="font-medium">{ticket.userFullName}</div>

                    <div className="text-sm text-gray-600 mt-3">Status</div>
                    <div className="font-medium">{ticket.status}</div>
                </div>

                <div className="mt-6 flex justify-center">
                    <QRCodeCanvas value={qrValue} size={220} />
                </div>

                <div className="mt-4 text-center text-xs text-gray-500 break-all">
                    Code: {ticket.ticketCode}
                </div>
            </div>
        </div>
    );
}