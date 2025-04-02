import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// import HomeComponent from './HomeComponent'; // Import the component you want to convert to PDF
// const PdfDownloadComponent = () => {

//   };
//   return (
//     <div>
//       <HomeComponent id="pdf-content" /> 
//       {/* Ensure to pass the same id to the target component */}
//       <button onClick={handleDownloadPDF}>Download PDF</button>
//     </div>
//   );
// };

export default function CustomerDetails({ customer, onBack }) {
    const pdfRef = useRef(null);

    // Scroll to the top when the component mounts
    React.useEffect(() => {
        // console.log(customer);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Format the date and time
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const formatDateTime = (dt) => {
        // dt = new Date(dt);
        return `${dt.date} ${months[dt.month - 1]}, ${dt.year} at ${dt.hour}:${dt.minute} ${dt.meridian}`;
    }
    // const formatDate = (date) => {
    //     date = new Date(date);
    //     return date.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //     })
    // };

    // const formatTime = (time) => {
    //     time = new Date(time);
    //     return time.toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //     })
    // };

    // const handleDownloadPDF = () => {
    //     const input = document.getElementById('pdf-content');
    //     // Specify the id of the element you want to convert to PDF
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('../../../public/assets/logo/new-logo.png');
    //         const pdf = new jsPDF();
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save('downloaded-file.pdf');
    //         // Specify the name of the downloaded PDF file
    //     });
    // }

    // const handleDownloadPDF = () => {
    //     // window.print();
    //     // Step 1: Get the content of the div
    //     const printableElement = document.getElementById('printableArea').innerHTML;

    //     // Step 2: Open a new window
    //     const printWindow = window.open('', '', 'height=500,width=800');

    //     // Step 3: Write the content to the new window
    //     printWindow.document.write('<html><head><title>Print</title>');
    //     printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>'); // Optional: Add styles
    //     printWindow.document.write('</head><body>');
    //     printWindow.document.write(printableElement); // Add the content
    //     printWindow.document.write('</body></html>');

    //     // Step 4: Close the document and trigger the print dialog
    //     printWindow.document.close();
    //     printWindow.print();
    // }

    const handleDownloadPDF = useReactToPrint({
        documentTitle: "Customer_Details",
        contentRef: pdfRef,
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
            <div className="max-w-fit">
                <div
                    // id="printableArea" 
                    id="pdf-content"
                    ref={pdfRef}
                    className="bg-zinc-200 shadow-lg rounded-lg p-3"
                >
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Filled Form Details</h2>
                    <div className="max-md:space-y-4 md:grid md:grid-cols-2 md:gap-4">
                        <div className="bg-gray-100 rounded-lg p-2 space-y-1">
                            {/* Personal Details */}
                            <h2 className="text-2xl font-semibold mb-4 bg-gray-300 rounded-lg p-2">Personal Details</h2>

                            {/* Customer Name */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Customer Name</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.customerName}</p>
                            </div>

                            {/* Date of Birth */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{`${customer.dateOfBirth.date} ${months[customer.dateOfBirth.month]} ${customer.dateOfBirth.year}`}</p>
                            </div>

                            {/* Mobile */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Mobile</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.mobile}</p>
                            </div>

                            {/* Alt Mobile */}
                            {(customer.altMobile) && (
                                <div className="px-2 py-1">
                                    <label className="block text-sm font-medium text-gray-600">Alternate Mobile</label>
                                    <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.altMobile}</p>
                                </div>
                            )}

                            {/* Current Address */}
                            <div className="col-span-2 px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Current Address</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.currentAddress?.houseFlatNo}, {customer.currentAddress?.streetName}, {customer.currentAddress?.city}, {customer.currentAddress?.state}, {customer.currentAddress?.country} - {customer.currentAddress?.pinCode}
                                </p>
                            </div>

                            {/* Years at Present Address */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Years at Present Address</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.yearsPresent}</p>
                            </div>

                            {/* Years in City */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Years in City</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.yearsCity}</p>
                            </div>

                            {/* Rental Status */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Rental Status</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.rentalStatus === "Y" ? "Renting" : "Not Renting"}
                                </p>
                            </div>

                            {/* Rental Amount */}
                            {customer.rentalStatus === "Y" && (
                                <div className="px-2 py-1">
                                    <label className="block text-sm font-medium text-gray-600">Rental Amount</label>
                                    <p className="mt-1 text-lg text-gray-900 font-semibold">₹{customer.rentalAmount}</p>
                                </div>)
                            }

                            {/* Permanent Address */}
                            {(customer.rentalStatus === "Y") && (
                                <div className="col-span-2 px-2 py-1">
                                    <label className="block text-sm font-medium text-gray-600">Permanent Address</label>
                                    <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.permanentAddress?.houseFlatNo}, {customer.permanentAddress?.streetName}, {customer.permanentAddress?.city}, {customer.permanentAddress?.state}, {customer.permanentAddress?.country} - {customer.permanentAddress?.pinCode}</p>
                                </div>)
                            }

                            {/* Marital Status */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Marital Status</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.maritalStatus === "Y" ? "Married" : "Single"}
                                </p>
                            </div>

                            {/* Spouse Name */}
                            {(customer.maritalStatus === "Y") && (
                                <div className="px-2 py-1">
                                    <label className="block text-sm font-medium text-gray-600">Spouse Name</label>
                                    <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.spouseName}</p>
                                </div>)
                            }
                            {/* Spouse DOB */}
                            {(customer.maritalStatus === "Y") && (
                                <div className="px-2 py-1">
                                    <label className="block text-sm font-medium text-gray-600">Spouse DOB</label>
                                    <p className="mt-1 text-lg text-gray-900 font-semibold">{`${customer.spouseDob.date} ${months[customer.spouseDob.month]} ${customer.spouseDob.year}`}</p>
                                </div>)
                            }

                            {/* Office Name */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Office Name</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.officeName}</p>
                            </div>

                            {/* Office Address */}
                            <div className="col-span-2 px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Office Address</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.officeAddress?.houseFlatNo}, {customer.officeAddress?.streetName}, {customer.officeAddress?.city}, {customer.officeAddress?.state}, {customer.officeAddress?.country} - {customer.officeAddress?.pinCode}
                                </p>
                            </div>

                            {/* Years Employed */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Years Employed</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.yearsEmployed}</p>
                            </div>

                            {/* Total Years Employed */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Total Years Employed</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.yearsTotalEmployed}</p>
                            </div>

                            {/* Cur Salary */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Current Salary</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">₹{customer.salary}</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-2 space-y-1">
                            {/* Loan and Bank Details */}
                            <h2 className="text-2xl font-semibold mb-4 bg-gray-300 rounded-lg p-2">Loan and Bank Details</h2>

                            {/* Bank Details */}
                            <div className="col-span-2 px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Bank Details</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.bankDetails?.name}, {customer.bankDetails?.branch} - {customer.bankDetails?.acNo}
                                </p>
                            </div>

                            {/* Loan Amount */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Loan Amount</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">₹{customer.loanAmount}</p>
                            </div>

                            {/* Prev EMI */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Previous EMI</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">₹{customer.prevEMI}</p>
                            </div>

                            {/* Relative Name */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Relative Name</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.relativeName}</p>
                            </div>

                            {/* Relative Mobile */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Relative Mobile</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.relativeMobile}</p>
                            </div>

                            {/* Relative Address */}
                            <div className="col-span-2 px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Relative Address</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.relativeAddress?.houseFlatNo}, {customer.relativeAddress?.streetName}, {customer.relativeAddress?.city}, {customer.relativeAddress?.state}, {customer.relativeAddress?.country} - {customer.relativeAddress?.pinCode}
                                </p>
                            </div>

                            {/* Friend Name */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Friend Name</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.friendName}</p>
                            </div>

                            {/* Friend Mobile */}
                            <div className="px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Friend Mobile</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">{customer.friendMobile}</p>
                            </div>

                            {/* Friend Address */}
                            <div className="col-span-2 px-2 py-1">
                                <label className="block text-sm font-medium text-gray-600">Friend Address</label>
                                <p className="mt-1 text-lg text-gray-900 font-semibold">
                                    {customer.friendAddress?.houseFlatNo}, {customer.friendAddress?.buildingName}, {customer.friendAddress?.streetName}, {customer.friendAddress?.area}, {customer.friendAddress?.city}, {customer.friendAddress?.state}, {customer.friendAddress?.country} - {customer.friendAddress?.pinCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-right mt-4">{`Date of submission: ${formatDateTime(customer.createdAt)}`}</p>

                    {/* <style>{getPageMargins()}</style> */}
                </div>

                {/* Back to List Button */}
                <div className="mt-8 text-center space-x-4">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => {
                            onBack();
                            window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
                        }}
                    >
                        Back to List
                    </button>
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        // onClick={printDiv}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}