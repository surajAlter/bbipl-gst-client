import React from "react";
// import { FaCircleCheck } from "react-icons/fa";

export default function GstForm({ formData, onBack }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Review Your Details</h2>
      {/* Business Details */}
      <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-blue-800">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><span className="font-medium">Trade Name:</span> {formData.tradeName || '-'}</p>
          <p><span className="font-medium">Additional Trade Names:</span> {formData.additionalTradeName.length ? formData.additionalTradeName.join(", ") : '-'}</p>
          <p><span className="font-medium">Business Constitution:</span> {formData.businessConstitution || '-'}</p>
          <p><span className="font-medium">Reason for Registration:</span> {formData.reason || '-'}</p>
          <p><span className="font-medium">Date of Commencement:</span> {new Date(formData.dateOfCommencement).toDateString() || '-'}</p>
          <p><span className="font-medium">Date Liability Register:</span> {new Date(formData.dateLiabilityRegister).toDateString() || '-'}</p>
          <p><span className="font-medium">Casual Taxable Person:</span> {formData.casualTaxable ? "Yes" : "No"}</p>
          <p><span className="font-medium">Composition Option:</span> {formData.compositionOption ? "Yes" : "No"}</p>
          <p><span className="font-medium">Existing Registrations:</span> {formData.existingRegs.length ? formData.existingRegs.join(", ") : '-'}</p>
        </div>
      </div>

      {/* Promoter/Partner Details */}
      <div className="bg-gradient-to-r from-green-200 to-green-100 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-green-800">Promoter / Partner Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p>
            <span className="font-medium">Full Name:</span>{" "}
            {`${formData.personName.firstName} ${formData.personName.midName} ${formData.personName.lastName}`.trim() || '-'}
          </p>
          <p>
            <span className="font-medium">Father's Name:</span>{" "}
            {`${formData.fatherName.firstName} ${formData.fatherName.midName} ${formData.fatherName.lastName}`.trim() || '-'}
          </p>
          <p><span className="font-medium">Date of Birth:</span> {new Date(formData.dob).toDateString() || '-'}</p>
          <p><span className="font-medium">Gender:</span> {formData.gender || '-'}</p>
          <p><span className="font-medium">Telephone:</span> {formData.telephone || '-'}</p>
          <p><span className="font-medium">Citizen of India:</span> {formData.citizenIndia ? "Yes" : "No"}</p>
          <p className="md:col-span-2">
            <span className="font-medium">Residential Address:</span>{" "}
            {`${formData.residentialAddress.buildingFlatNo}, ${formData.residentialAddress.premisesBuildingName}, ${formData.residentialAddress.streetName}, ${formData.residentialAddress.city}, ${formData.residentialAddress.state}, ${formData.residentialAddress.pinCode}` || '-'}
          </p>
        </div>
      </div>

      {/* Authorized Signatory */}
      <div className="bg-gradient-to-r from-purple-200 to-purple-100 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-purple-800">Authorized Signatory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><span className="font-medium">Authorized Signatory:</span> {formData.isAuthorizedSignatory ? "Yes" : "No"}</p>
          <p><span className="font-medium">Primary Signatory:</span> {formData.isPrimaryAuthorizedSignatory ? "Yes" : "No"}</p>
          <p><span className="font-medium">Proof Document:</span> {formData.proofOfAuthorizedSignatory || '-'}</p>
        </div>
      </div>

      {/* Principal Place of Business */}
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-yellow-800">Principal Place of Business</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p>
            <span className="font-medium">Address:</span>{" "}
            {`${formData.principalPlaceOfBusiness.buildingFlatNo}, ${formData.principalPlaceOfBusiness.premisesBuildingName}, ${formData.principalPlaceOfBusiness.streetName}` || '-'}
          </p>
          <p><span className="font-medium">City:</span> {formData.principalPlaceOfBusiness.city || '-'}</p>
          <p><span className="font-medium">District:</span> {formData.principalPlaceOfBusiness.district || '-'}</p>
          <p><span className="font-medium">State:</span> {formData.principalPlaceOfBusiness.state || '-'}</p>
          <p><span className="font-medium">PIN Code:</span> {formData.principalPlaceOfBusiness.pinCode || '-'}</p>
          <p className="md:col-span-2">
            <span className="font-medium">Center Jurisdiction:</span>{" "}
            {`Commisionerate: ${formData.centerJurisdiction.commisionerate}, Division: ${formData.centerJurisdiction.division}, Range: ${formData.centerJurisdiction.range}` || '-'}
          </p>
        </div>
      </div>

      {/* Goods & Services */}
      <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-pink-800">Goods & Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><span className="font-medium">Goods:</span> {formData.goods.length ? formData.goods.join(", ") : '-'}</p>
          <p><span className="font-medium">Services:</span> {formData.services.length ? formData.services.join(", ") : '-'}</p>
          <p className="md:col-span-2">
            <span className="font-medium">Nature of Business:</span> {formData.natureOfBusiness.length ? formData.natureOfBusiness.join(", ") : '-'}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium">Additional Places of Business:</span> {formData.additionalPlaceOfBusiness.length ? formData.additionalPlaceOfBusiness.join(", ") : '-'}
          </p>
        </div>
      </div>

      {/* State Specific Information */}
      <div className="bg-gradient-to-r from-indigo-200 to-indigo-100 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-indigo-800">State Specific Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><span className="font-medium">Pro Tax Emp Code No:</span> {formData.proTaxEmpCodeNo || '-'}</p>
          <p><span className="font-medium">Pro Tax Reg Certificate No:</span> {formData.proTaxRegCertificateNo || '-'}</p>
          <p><span className="font-medium">State Excise Licence No:</span> {formData.stateExciseLicenceNo || '-'}</p>
          <p><span className="font-medium">Excise Licence Name:</span> {formData.nameExciseLicence || '-'}</p>
        </div>
      </div>

      {/* Verification Details */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-gray-800">Verification Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><span className="font-medium">Name of Authorizing Signatory:</span> {formData.nameAuthSignatory || '-'}</p>
          <p><span className="font-medium">Place of Authorization:</span> {formData.placeAuthSignatory || '-'}</p>
          <p><span className="font-medium">Designation of Authorizing Signatory:</span> {formData.designationAuthSignatory || '-'}</p>
          <p><span className="font-medium">Submission Date:</span> {new Date(formData.submitDate).toLocaleString() || '-'}</p>
        </div>
      </div>

      <div className="mt-8 text-center space-x-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            onBack();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
