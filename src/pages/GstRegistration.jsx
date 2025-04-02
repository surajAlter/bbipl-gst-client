import React, { useState, useEffect } from 'react';
// import { MapPin, ClipboardCheck, ChevronRight, ChevronLeft, BriefcaseBusiness, UsersRound, PenTool, ShoppingCart, MapPinPlus, IdCard } from 'lucide-react';
import axios from 'axios';
import { LuBriefcaseBusiness, LuChevronLeft, LuChevronRight, LuClipboardCheck, LuMapPin, LuPenTool, LuUsersRound } from 'react-icons/lu';
import { FaIdCard, FaPhone, FaRegAddressCard, FaUser, FaUserTie, FaEnvelope, FaCircleInfo, FaEnvelopeOpen, FaMobileScreen, FaFax, FaBuilding, FaTruck, FaCircleCheck } from 'react-icons/fa6';
import { LiaLuggageCartSolid } from 'react-icons/lia';
import { FaCloudUploadAlt, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';

const formFields = [
    // 'role',
    // 'state',
    // 'district',
    // 'businessName',
    // 'pan',
    // 'email',
    // 'mobile',

    //business details
    'tradeName',
    'businessConstitution',
    'reason',
    'dateOfCommencement',
    'dateLiabilityRegister',

    //Promoter/Partners
    //->personal info
    'dob',
    'gender',
    'telephone',
    //->identity info
    'designation',
    'directorIdentificationNo',
    'passportNo',
    'aadhaarNo',
    //->documents
    'photo',

    //Authorized Signatory
    'proofOfAuthorizedSignatory',

    //Principal Place of Business
    'stateJurisdiction',
    'officeTelephone',
    'officeEmail',
    'officeMobile',
    'officeFax',
    'possessionPremise',
    'proofPrincipalPlaceBusiness',

    //State specific info
    'proTaxEmpCodeNo',
    'proTaxRegCertificateNo',
    'stateExciseLicenceNo',
    'nameExciseLicence',

    //Verification
    'nameAuthSignatory',
    'placeAuthSignatory',
    'designationAuthSignatory',
    'submitDate',


    //temp
    'otherNatureOfBusiness',
];

let formFieldStructure = formFields.reduce((acc, field) => {
    acc[field] = '';
    return acc;
}, {
    //business details
    additionalTradeName: [],
    casualTaxable: false,
    compositionOption: false,
    existingRegs: [],

    //promoter/parteners
    //->personal info
    personName: { firstName: '', midName: '', lastName: '' },
    fatherName: { firstName: '', midName: '', lastName: '' },
    citizenIndia: true,
    //->identity info
    residentialAddress: {
        buildingFlatNo: "",
        premisesBuildingName: "",
        streetName: "",
        locality: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
        country: "India",
        floorNo: "",
        landmark: "",
    },
    //->other info
    isAuthorizedSignatory: false,

    // Authorized Signatory
    isPrimaryAuthorizedSignatory: false,

    // Authorized Representative
    hasAuthorizedRepresentative: false,

    // Principal Place of Business
    principalPlaceOfBusiness: {
        buildingFlatNo: "",
        premisesBuildingName: "",
        streetName: "",
        locality: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
        country: "India"
    },
    centerJurisdiction: {
        commisionerate: '',
        division: '',
        range: '',
    },
    natureOfBusiness: [],
    additionalPlaceOfBusiness: [],

    // Goods & Services
    goods: [],
    services: [],
});

function GstRegistration() {
    const sections = [
        // { id: 'personal', title: 'Personal Information', icon: <User className="w-5 h-5" /> },
        { id: 'business', title: 'Business Details', icon: <LuBriefcaseBusiness className="w-5 h-5" /> },
        { id: 'promoter', title: 'Promoter / Partners', icon: <FaUserTie className="w-5 h-5" /> },
        { id: 'signatory', title: 'Authorized Signatory', icon: <LuPenTool className="w-5 h-5" /> },
        { id: 'representative', title: 'Authorized Representative', icon: <LuUsersRound className="w-5 h-5" /> },
        { id: 'place', title: 'Principal Place of Business', icon: <LuMapPin className="w-5 h-5" /> },
        // { id: 'additional-place', title: 'Additional Place of Business', icon: <LuMapPinPlus className="w-5 h-5" /> },
        { id: 'goods-services', title: 'Goods & Services', icon: <LiaLuggageCartSolid className="w-7 h-7 -mx-1" /> },
        { id: 'state-info', title: 'State Specific Information', icon: <FaRegAddressCard className="w-5 h-5" /> },
        { id: 'summary', title: 'Review & Submit', icon: <LuClipboardCheck className="w-5 h-5" /> },
    ];

    const [sessionId, setSessionId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedSteps, setFetchedSteps] = useState(new Set());
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [furthestStep, setFurthestStep] = useState(sections.length - 1);
    const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
    const [isFormVerified, setIsFormVerified] = useState(false);
    const [formData, setFormData] = useState(formFieldStructure);

    const [inputValues, setInputValues] = useState({
        goods: '',
        services: ''
    });

    // Mapping required fields per section. Use dot notation for nested values.
    const requiredFields = {
        business: ["tradeName", "businessConstitution", "reason", "dateOfCommencement"],
        promoter: ["personName.firstName", "fatherName.firstName", "dob", "gender", "designation", "aadhaarNo", "residentialAddress.country", "residentialAddress.pinCode", "residentialAddress.state", "residentialAddress.district", "residentialAddress.city", "residentialAddress.streetName", "residentialAddress.buildingFlatNo"],
        // signatory: ["proofOfAuthorizedSignatory"],
        place: ["principalPlaceOfBusiness.pinCode", "principalPlaceOfBusiness.state", "principalPlaceOfBusiness.district", "principalPlaceOfBusiness.city", "principalPlaceOfBusiness.streetName", "principalPlaceOfBusiness.buildingFlatNo", "stateJurisdiction", "centerJurisdiction.commisionerate", "centerJurisdiction.division", "centerJurisdiction.range", "officeEmail", "officeMobile", "possessionPremise",
            // "proofPrincipalPlaceBusiness",
        ],
        "goods-services": ["goods", "services"],
        summary: ["nameAuthSignatory", "placeAuthSignatory", "designationAuthSignatory", "nameAuthSignatory", "placeAuthSignatory", "designationAuthSignatory"],
    };

    // Helper to get nested value
    const getNestedValue = (obj, key) => key.split('.').reduce((o, k) => (o ? o[k] : ''), obj);

    // Validate current section by checking each required field is non-empty
    useEffect(() => {
        const validateCurrentStep = () => {
            if (requiredFields[activeSection]) {
                return requiredFields[activeSection].every(field => {
                    const value = getNestedValue(formData, field);
                    if (field === "natureOfBusiness") {
                        let sum = 0;
                        for (let i = 0; i < value.length; i++) {
                            sum += value[i];
                        }
                        return sum > 0;
                    } else if (field === "goods" || field === "services") {
                        return value && value.length > 0;
                    }
                    return value && value.toString().trim() !== "";
                });
            }
            return true;
        };

        setIsCurrentStepValid(validateCurrentStep());
    }, [formData, activeSection, requiredFields]);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const response = await axios.get('https://example.com/api/gst-registration/init');

                if (response.status !== 200) {
                    throw new Error('Failed to initialize session');
                }

                setSessionId(response.data.sessionId);

                if (response.data.progress) {
                    setActiveSection(response.data.progress.currentStep);
                    setFurthestStep(response.data.progress.furthestStep);
                    setFormData(prev => ({
                        ...prev,
                        ...response.data.progress.formData
                    }));
                }
            } catch (error) {
                console.error('Initialization error:', error);
                // alert('Failed to initialize session');
            }
        };

        if (!sessionId) {
            initializeSession();
        }
    }, [sessionId, setSessionId]);

    const handleNext = async () => {
        console.log(formData);
        if (!isCurrentStepValid) return;

        const newFurthest = Math.max(furthestStep, currentStepIndex + 1);
        setFurthestStep(newFurthest);

        if (currentStepIndex < sections.length - 1) {
            setActiveSection(sections[currentStepIndex + 1].id);
        }

        // if (!isCurrentStepValid || isSaving) return;
        // try {
        //     setIsSaving(true);
        //     await axios.put(
        //         `https://example.com/api/gst-registration/${sessionId}/steps/${activeSection}`,
        //         formData
        //     );

        //     const newFurthest = Math.max(furthestStep, currentStepIndex + 1);
        //     setFurthestStep(newFurthest);

        //     if (currentStepIndex < sections.length - 1) {
        //         setActiveSection(sections[currentStepIndex + 1].id);
        //     }
        // } catch (error) {
        //     console.error('Save error:', error);
        //     alert('Failed to save progress');
        // } finally {
        //     setIsSaving(false);
        // }
    };

    const handleBack = async () => {
        if (currentStepIndex === 0) return;
        const prevSection = sections[currentStepIndex - 1].id;
        setActiveSection(prevSection);

        // if (currentStepIndex === 0 || isFetching) return;

        // const prevSection = sections[currentStepIndex - 1].id;

        // if (!fetchedSteps.has(prevSection)) {
        //     try {
        //         setIsFetching(true);
        //         const response = await axios.get(
        //             `https://example.com/api/gst-registration/${sessionId}/steps/${prevSection}`
        //         );

        //         setFormData(prev => ({
        //             ...prev,
        //             ...response.data
        //         }));
        //         setFetchedSteps(prev => new Set([...prev, prevSection]));
        //     } catch (error) {
        //         console.error('Fetch error:', error);
        //         alert('Failed to load previous step data');
        //         return;
        //     } finally {
        //         setIsFetching(false);
        //     }
        // }

        // setActiveSection(prevSection);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/gst/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status !== 200) throw new Error('Failed to submit form');

            alert('Form submitted successfully!');
            window.location.href = "/";
        } catch (error) {
            console.error('Submission error:', error);
            alert('Submission failed. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested fields (like residenceAddress.city)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        }
        // Handle top-level fields (including temporary inputs)
        else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Generalized add item handler
    const handleAddItem = (type) => {
        const newItem = inputValues[type].trim();

        if (!newItem) return;
        else if (formData[type].length >= 5) return;

        const isDuplicate = formData[type].some(
            item => item.toLowerCase() === newItem.toLowerCase()
        );

        if (!isDuplicate) {
            setFormData(prev => ({
                ...prev,
                [type]: [...prev[type], newItem],
            }));

            setInputValues(prev => ({
                ...prev,
                [type]: '',
            }))
        }
    };

    // Generalized remove item handler
    const handleRemoveItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const currentStepIndex = sections.findIndex(s => s.id === activeSection);
    const backButtonDisabled = currentStepIndex === 0 || isFetching || isSaving;
    const nextButtonDisabled = !isCurrentStepValid || isSaving || isFetching;

    return (
        <div className="bg-gray-50">
            <header className="bg-blue-700 text-white py-6 px-4 shadow-lg">
                <div className="mx-auto">
                    <h1 className="text-3xl font-bold">GST Registration</h1>
                    <p className="mt-2 text-blue-100">Provide your GST registration details</p>
                </div>
            </header>

            <main className="mx-auto py-8 px-4">
                <div className="grid md:grid-cols-8 gap-4 mb-8">
                    {sections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => index <= furthestStep && setActiveSection(section.id)}
                            disabled={index > furthestStep}
                            className={`flex items-center p-4 rounded-lg transition-all ${activeSection === section.id
                                ? `bg-blue-700 text-white`
                                : index > furthestStep
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-blue-50'
                                } shadow-sm`}
                        >
                            <div className="mr-3">{section.icon}</div>
                            <div className="text-left">
                                <div className="text-sm font-medium">{section.title}</div>
                                <div className="text-xs mt-1 opacity-75">Step {index + 1}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    {activeSection === 'summary' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-gray-800 text-center">Review Your Details</h2>

                            {/* Business Details Card */}
                            <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-blue-800">Business Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Trade Name:</span> {formData.tradeName || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Additional Trade Names:</span> {formData.additionalTradeName.length ? formData.additionalTradeName.join(", ") : '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Business Constitution:</span> {formData.businessConstitution || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Reason for Registration:</span> {formData.reason || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Date of Commencement:</span> {formData.dateOfCommencement || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Date Liability Register:</span> {formData.dateLiabilityRegister || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Casual Taxable Person:</span> {formData.casualTaxable ? "Yes" : "No"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Composition Option:</span> {formData.compositionOption ? "Yes" : "No"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Existing Registrations:</span> {formData.existingRegs.length ? formData.existingRegs.join(", ") : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Promoter/Partner Details Card */}
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
                                    <p>
                                        <span className="font-medium">Date of Birth:</span> {formData.dob || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Gender:</span> {formData.gender || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Telephone:</span> {formData.telephone || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Citizen of India:</span> {formData.citizenIndia ? "Yes" : "No"}
                                    </p>
                                    <p className="md:col-span-2">
                                        <span className="font-medium">Residential Address:</span>{" "}
                                        {`${formData.residentialAddress.buildingFlatNo}, ${formData.residentialAddress.premisesBuildingName}, ${formData.residentialAddress.streetName}, ${formData.residentialAddress.city}, ${formData.residentialAddress.state}, ${formData.residentialAddress.pinCode}` || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Authorized Signatory Card */}
                            <div className="bg-gradient-to-r from-purple-200 to-purple-100 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-purple-800">Authorized Signatory</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Authorized Signatory:</span> {formData.isAuthorizedSignatory ? "Yes" : "No"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Primary Signatory:</span> {formData.isPrimaryAuthorizedSignatory ? "Yes" : "No"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Proof Document:</span> {formData.proofOfAuthorizedSignatory || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Principal Place of Business Card */}
                            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-yellow-800">Principal Place of Business</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Address:</span>{" "}
                                        {`${formData.principalPlaceOfBusiness.buildingFlatNo}, ${formData.principalPlaceOfBusiness.premisesBuildingName}, ${formData.principalPlaceOfBusiness.streetName}` || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">City:</span> {formData.principalPlaceOfBusiness.city || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">District:</span> {formData.principalPlaceOfBusiness.district || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">State:</span> {formData.principalPlaceOfBusiness.state || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">PIN Code:</span> {formData.principalPlaceOfBusiness.pinCode || '-'}
                                    </p>
                                    <p className="md:col-span-2">
                                        <span className="font-medium">Center Jurisdiction:</span>{" "}
                                        {`Commisionerate: ${formData.centerJurisdiction.commisionerate}, Division: ${formData.centerJurisdiction.division}, Range: ${formData.centerJurisdiction.range}` || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Goods & Services Card */}
                            <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-pink-800">Goods & Services</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Goods:</span> {formData.goods.length ? formData.goods.join(", ") : '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Services:</span> {formData.services.length ? formData.services.join(", ") : '-'}
                                    </p>
                                    <p className="md:col-span-2">
                                        <span className="font-medium">Nature of Business:</span> {formData.natureOfBusiness.length ? formData.natureOfBusiness.join(", ") : '-'}
                                    </p>
                                    <p className="md:col-span-2">
                                        <span className="font-medium">Additional Places of Business:</span> {formData.additionalPlaceOfBusiness.length ? formData.additionalPlaceOfBusiness.join(", ") : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* State Specific Information Card */}
                            <div className="bg-gradient-to-r from-indigo-200 to-indigo-100 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-indigo-800">State Specific Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Pro Tax Emp Code No:</span> {formData.proTaxEmpCodeNo || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Pro Tax Reg Certificate No:</span> {formData.proTaxRegCertificateNo || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">State Excise Licence No:</span> {formData.stateExciseLicenceNo || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Excise Licence Name:</span> {formData.nameExciseLicence || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Verification Details Card */}
                            <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold border-b pb-2 mb-4 text-gray-800">Verification Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <p>
                                        <span className="font-medium">Name of Authorizing Signatory:</span> {formData.nameAuthSignatory || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Place of Authorization:</span> {formData.placeAuthSignatory || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Designation of Authorizing Signatory:</span> {formData.designationAuthSignatory || '-'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Submission Date:</span> {formData.submitDate || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaCircleCheck className='mt-1' /> Verification </h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className='col-span-2'>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isFormVerified"
                                                checked={isFormVerified}
                                                onChange={(e) => setIsFormVerified(e.target.checked)}
                                            />

                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.
                                            </span>
                                            <span className='text-red-600'>*</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of Authorized Signatory <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nameAuthSignatory"
                                        value={formData.nameAuthSignatory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Place <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="placeAuthSignatory"
                                        value={formData.placeAuthSignatory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Place"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation / Status<span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="designationAuthSignatory"
                                        value={formData.designationAuthSignatory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Designation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date <span className='text-red-600'>*</span>
                                    </label>
                                    <h4 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "> {new Date().toLocaleDateString('en-GB')} </h4>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'personal' && (
                        // Business Details Form
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                            <div className="border-t border-gray-500" />
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        I am a (role)
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        {/* Select
Taxpayer
Tax Deductor
Tax Collector (e-Commerce)
GST Practitioner
Non Resident Taxable Person
United Nation Body
Consulate or Embassy of Foreign Country
Other Notified Person
Non-Resident Online Services Provider and/or Non-Resident Online Money Gaming Supplier */}
                                        <option value="">Select Role</option>
                                        <option value="taxpayer">Taxpayer</option>
                                        <option value="taxDeductor">Tax Deductor</option>
                                        <option value="taxCollector">Tax Collector (e-Commerce)</option>
                                        <option value="gstPractitioner">GST Practitioner</option>
                                        <option value="nonResidentTaxablePerson">Non Resident Taxable Person</option>
                                        <option value="unitedNationBody">United Nation Body</option>
                                        <option value="consulateOrEmbassyForeignCountry">Consulate or Embassy of Foreign Country</option>
                                        <option value="otherNotifiedPerson">Other Notified Person</option>
                                        <option value="nonResidentOnlineServicesProvider">Non-Resident Online Services Provider and/or Non-Resident Online Money Gaming Supplier</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State/UT
                                    </label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select State/UT</option>
                                        <option value="andhraPradesh">Andhra Pradesh</option>
                                        <option value="arunachalPradesh">Arunachal Pradesh</option>
                                        <option value="assam">Assam</option>
                                        <option value="bihar">Bihar</option>
                                        <option value="chhattisgarh">Chhattisgarh</option>
                                        <option value="goa">Goa</option>
                                        <option value="gujarat">Gujarat</option>
                                        <option value="haryana">Haryana</option>
                                        <option value="himachalPradesh">Himachal Pradesh</option>
                                        <option value="jharkhand">Jharkhand</option>
                                        <option value="karnataka">Karnataka</option>
                                        <option value="kerala">Kerala</option>
                                        <option value="madhyaPradesh">Madhya Pradesh</option>
                                        <option value="maharashtra">Maharashtra</option>
                                        <option value="manipur">Manipur</option>
                                        <option value="meghalaya">Meghalaya</option>
                                        <option value="mizoram">Mizoram</option>
                                        <option value="nagaland">Nagaland</option>
                                        <option value="odisha">Odisha</option>
                                        <option value="punjab">Punjab</option>
                                        <option value="rajasthan">Rajasthan</option>
                                        <option value="sikkim">Sikkim</option>
                                        <option value="tamilNadu">Tamil Nadu</option>
                                        <option value="telangana">Telangana</option>
                                        <option value="tripura">Tripura</option>
                                        <option value="uttarPradesh">Uttar Pradesh</option>
                                        <option value="uttarakhand">Uttarakhand</option>
                                        <option value="westBengal">West Bengal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    {/* <select
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select District</option>
                                        <option value="mumbai">Mumbai</option>
                                        <option value="thane">Thane</option>
                                    </select> */}
                                    <input
                                        type="text"
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter district name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Legal Name of Business (As per PAN)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter legal business name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permanent Account Number (PAN)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.pan}
                                        onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter 10-digit PAN"
                                        maxLength="10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter email address"
                                    />
                                    {/* <p className="text-xs text-gray-500 mt-1">OTP will be sent to this email</p> */}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter 10-digit mobile number"
                                            maxLength="10"
                                        />
                                    </div>
                                    {/* <p className="text-xs text-gray-500 mt-1">Separate OTP will be sent to this number</p> */}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'business' && (
                        // Business Details Form
                        <div className="space-y-6">
                            <div className='space-y-2'>
                                <h3 className="text-2xl font-semibold text-gray-800 flex gap-x-2 "> Details of your Business </h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trade Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tradeName}
                                        onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Trade Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Constitution
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessConstitution}
                                        onChange={(e) => setFormData({ ...formData, businessConstitution: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Business Constitution"
                                        required
                                    />
                                </div>
                                {/* Todo: Additional Trade Names */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Are you applying for registration as a casual taxable person?
                                </label>
                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.casualTaxable}
                                            onChange={(e) => setFormData({ ...formData, casualTaxable: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">
                                            {formData.casualTaxable ? 'Yes' : 'No'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Option For Composition
                                    </label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.compositionOption}
                                                onChange={(e) => setFormData({ ...formData, compositionOption: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.compositionOption ? 'Yes' : 'No'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason to obtain registration
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            // placeholder="Enter Reason"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of commencement of Business
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                                FROM
                                            </span>
                                            <input
                                                type="date"
                                                value={formData.dateOfCommencement}
                                                onChange={(e) => setFormData({ ...formData, dateOfCommencement: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            // max={new Date().toISOString().split('T')[0]} // Optional: Restrict to past dates
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date on which liability to register arises
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="date"
                                                value={formData.dateLiabilityRegister}
                                                onChange={(e) => setFormData({ ...formData, dateLiabilityRegister: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            // min={new Date().toISOString().split('T')[0]} // Optional: Restrict to past dates
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <h3 className="text-2xl font-semibold text-gray-800 flex gap-x-2 "> Indicate Existing Registrations </h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <p>Todo</p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'promoter' && (
                        // Promoter Details Form
                        <div className="space-y-6">


                            <div className='space-y-2'>
                                <h2 className="text-2xl font-semibold text-gray-800">Details of Proprietor</h2>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaUser className='mt-1' /> Personal Information</h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block text-sm font-bold text-blue-900 -mb-2 col-span-3">
                                    Name of Person
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.firstName"
                                        value={formData.personName.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.midName"
                                        value={formData.personName.midName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Middle Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.lastName"
                                        value={formData.personName.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block text-sm font-bold text-blue-900 -mb-2 col-span-3">
                                    Name of Father
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.firstName"
                                        value={formData.fatherName.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.midName"
                                        value={formData.fatherName.midName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Middle Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.lastName"
                                        value={formData.fatherName.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-x-4 gap-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        max={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id="genderMale"
                                            name="gender"
                                            value="Male"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderMale" className="mr-4">Male</label>

                                        <input
                                            type="radio"
                                            id="genderFemale"
                                            name="gender"
                                            value="Female"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderFemale" className="mr-4">Female</label>

                                        <input
                                            type="radio"
                                            id="genderOther"
                                            name="gender"
                                            value="Other"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderOther">Other</label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline -mt-1 mr-1" /> Telephone Number (with STD Code)
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            STD
                                        </span>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter Telephone Number'
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaIdCard className='mt-1' /> Identity Information</h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation / Status
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Designation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Director Identification Number
                                    </label>
                                    <input
                                        type="text"
                                        name="directorIdentificationNo"
                                        value={formData.directorIdentificationNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter DIN Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Are you a citizen of India?
                                    </label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="citizenIndia"
                                                checked={formData.citizenIndia}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.citizenIndia ? 'Yes' : 'No'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Passport Number (In case of Foreigner)
                                    </label>
                                    <input
                                        type="text"
                                        name="passportNo"
                                        value={formData.passportNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Passport Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhaar Number
                                    </label>
                                    <input
                                        type="text"
                                        name="aadhaarNo"
                                        value={formData.aadhaarNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Aadhaar Number"
                                    />
                                </div>
                            </div>


                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaIdCard className='mt-1' /> Residential Address</h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.country"
                                        value={formData.residentialAddress.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Country"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PIN Code
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.pinCode"
                                        value={formData.residentialAddress.pinCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter PIN Code"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.state"
                                        value={formData.residentialAddress.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter State Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.district"
                                        value={formData.residentialAddress.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter District Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City / Town / Village
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.city"
                                        value={formData.residentialAddress.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter City / Town / Village"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Locality / Sub Locality
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.locality"
                                        value={formData.residentialAddress.locality}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Locality / Sublocality"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Road / Street
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.streetName"
                                        value={formData.residentialAddress.streetName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Road / Street / Lane"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of the Premises / Building
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.premisesBuildingName"
                                        value={formData.residentialAddress.premisesBuildingName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Name of Premises / Building"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Building No. / Flat No.
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.buildingFlatNo"
                                        value={formData.residentialAddress.buildingFlatNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Building No. / Flat No. / Door No."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Floor No.
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.floorNo"
                                        value={formData.residentialAddress.floorNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Floor No."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nearby Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.landmark"
                                        value={formData.residentialAddress.landmark}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Nearby Landmark"
                                    />
                                </div>
                            </div>


                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaCloudUploadAlt className='mt-1' /> Document Upload</h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                Todo
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.country"
                                        value={formData.residentialAddress.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Country"
                                        required
                                    />
                                </div> */}
                            </div>


                            <div className='space-y-2'>
                                {/* <div className="border-t border-gray-400" /> */}
                                <h3 className="text-2xl font-semibold text-gray-800">Other Information</h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Also Authorized Signatory
                                    </label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isAuthorizedSignatory"
                                                checked={formData.isAuthorizedSignatory}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.isAuthorizedSignatory ? 'Yes' : 'No'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'signatory' && (
                        // Authorized Signatory Details Form
                        <div className="space-y-6">
                            <div className='space-y-2'>
                                <h3 className="text-2xl font-semibold text-gray-800 flex gap-x-2 "> Details of Authorized Signatory </h3>
                                <div className="border-t border-gray-400" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isPrimaryAuthorizedSignatory"
                                                checked={formData.isPrimaryAuthorizedSignatory}
                                                onChange={handleChange}
                                                className=""
                                            />
                                            {/* <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div> */}
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                'Primary Authorized Signatory'
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Take this into account if it is not the primary signatory (i.e. if isPrimaryAuthorizedSignatory is false from above) */}
                            {/* <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaUser className='mt-1' /> Personal Information</h3>
                            <div className="border-t border-gray-500" />
                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block text-sm font-bold text-blue-900 -mb-2 col-span-3">
                                    Name of Person
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.firstName"
                                        value={formData.personName.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.midName"
                                        value={formData.personName.midName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Middle Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="personName.lastName"
                                        value={formData.personName.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block text-sm font-bold text-blue-900 -mb-2 col-span-3">
                                    Name of Father
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.firstName"
                                        value={formData.fatherName.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter First Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.midName"
                                        value={formData.fatherName.midName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Middle Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fatherName.lastName"
                                        value={formData.fatherName.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-x-4 gap-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline -mt-1 mr-1" /> Mobile Number
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter Telephone Number'
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Email Address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id="genderMale"
                                            name="gender"
                                            value="Male"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderMale" className="mr-4">Male</label>

                                        <input
                                            type="radio"
                                            id="genderFemale"
                                            name="gender"
                                            value="Female"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderFemale" className="mr-4">Female</label>

                                        <input
                                            type="radio"
                                            id="genderOther"
                                            name="gender"
                                            value="Other"
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor="genderOther">Other</label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline -mt-1 mr-1" /> Telephone Number (with STD Code)
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            STD
                                        </span>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter Telephone Number'
                                        />
                                    </div>
                                </div>
                            </div>


                            <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaIdCard className='mt-1' /> Identity Information</h3>
                            <div className="border-t border-gray-500" />
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation / Status
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Designation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Director Identification Number
                                    </label>
                                    <input
                                        type="text"
                                        name="directorIdentificationNo"
                                        value={formData.directorIdentificationNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter DIN Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Are you a citizen of India?
                                    </label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="citizenIndia"
                                                checked={formData.citizenIndia}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.citizenIndia ? 'Yes' : 'No'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Passport Number (In case of Foreigner)
                                    </label>
                                    <input
                                        type="text"
                                        name="passportNo"
                                        value={formData.passportNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Passport Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhaar Number
                                    </label>
                                    <input
                                        type="text"
                                        name="aadhaarNo"
                                        value={formData.aadhaarNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Aadhaar Number"
                                    />
                                </div>
                            </div>


                            <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaIdCard className='mt-1' /> Residential Address </h3>
                            <div className="border-t border-gray-500" />
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.country"
                                        value={formData.residentialAddress.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Country"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PIN Code
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.pinCode"
                                        value={formData.residentialAddress.pinCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter PIN Code"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.state"
                                        value={formData.residentialAddress.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter State Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.district"
                                        value={formData.residentialAddress.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter District Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City / Town / Village
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.city"
                                        value={formData.residentialAddress.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter City / Town / Village"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Locality / Sub Locality
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.locality"
                                        value={formData.residentialAddress.locality}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Locality / Sublocality"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Road / Street
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.streetName"
                                        value={formData.residentialAddress.streetName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Road / Street / Lane"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of the Premises / Building
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.premisesBuildingName"
                                        value={formData.residentialAddress.premisesBuildingName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Name of Premises / Building"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Building No. / Flat No.
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.buildingFlatNo"
                                        value={formData.residentialAddress.designation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Building No. / Flat No. / Door No."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Floor No.
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.floorNo"
                                        value={formData.residentialAddress.floorNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Floor No."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nearby Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="residentialAddress.landmark"
                                        value={formData.residentialAddress.landmark}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Nearby Landmark"
                                    />
                                </div>
                            </div>


                            <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaCloudUploadAlt className='mt-1' /> Document Upload </h3>
                            <div className="border-t border-gray-500" />
                            <div className="grid md:grid-cols-3 gap-4">
                                Todo
                            </div> */}
                        </div>
                    )}

                    {activeSection === 'representative' && (
                        <div className="space-y-6">
                            <div className='space-y-2'>
                                <h3 className="text-2xl font-semibold text-gray-800 flex gap-x-2 "> Details of Authorized Representative </h3>
                                <div className="border-t border-gray-400" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Do you have any Authorized Representative?
                                    </label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="hasAuthorizedRepresentative"
                                                checked={formData.hasAuthorizedRepresentative}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.hasAuthorizedRepresentative ? 'Yes' : 'No'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'place' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Details of Principal Place of Business</h2>

                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaEnvelope className='mt-1' /> Address </h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PIN Code <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.pinCode"
                                        value={formData.principalPlaceOfBusiness.pinCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter PIN Code"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.state"
                                        value={formData.principalPlaceOfBusiness.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter State Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.district"
                                        value={formData.principalPlaceOfBusiness.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter District Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City / Town / Village <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.city"
                                        value={formData.principalPlaceOfBusiness.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter City / Town / Village"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Locality / Sub Locality
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.locality"
                                        value={formData.principalPlaceOfBusiness.locality}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Locality / Sublocality"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Road / Street <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.streetName"
                                        value={formData.principalPlaceOfBusiness.streetName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Road / Street / Lane"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of the Premises / Building
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.premisesBuildingName"
                                        value={formData.principalPlaceOfBusiness.premisesBuildingName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Name of Premises / Building"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Building No. / Flat No. <span className='text-red-600'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.buildingFlatNo"
                                        value={formData.principalPlaceOfBusiness.buildingFlatNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Building No. / Flat No. / Door No."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Floor No.
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.floorNo"
                                        value={formData.principalPlaceOfBusiness.floorNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Floor No."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nearby Landmark
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.landmark"
                                        value={formData.principalPlaceOfBusiness.landmark}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Nearby Landmark"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.latitude"
                                        value={formData.principalPlaceOfBusiness.latitude}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Latitude"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        name="principalPlaceOfBusiness.longitude"
                                        value={formData.principalPlaceOfBusiness.longitude}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Longitude"
                                    />
                                </div>
                            </div>


                            <div className='grid md:grid-cols-3 gap-4'>
                                <div className="flex gap-1 text-sm font-bold -mb-2">
                                    State Jurisdiction Ward :
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sector / Circle / Ward / Charge / Unit
                                    </label>
                                    <input
                                        type="text"
                                        name="stateJurisdiction"
                                        value={formData.stateJurisdiction}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Ward"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-1 text-sm font-bold -mb-2">
                                Center Jurisdiction (<FaCircleInfo className='text-blue-900 mt-1' /> Refer the <a href='https://cbic-gst.gov.in/cbec-portal-ui/?knowYourJuris' target="_blank" rel="noreferrer" className='text-blue-900'>link</a> for Center Jurisdiction)
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commisionerate
                                    </label>
                                    <input
                                        type="text"
                                        name="centerJurisdiction.commisionerate"
                                        value={formData.centerJurisdiction.commisionerate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Commisionerate"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Division
                                    </label>
                                    <input
                                        type="text"
                                        name="centerJurisdiction.division"
                                        value={formData.centerJurisdiction.division}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Division"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="centerJurisdiction.range"
                                        value={formData.centerJurisdiction.range}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Range"
                                        required
                                    />
                                </div>
                            </div>


                            <div className='space-y-2 pt-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaEnvelope className='mt-1' /> Contact Information </h3>
                                <div className="border-t border-gray-400" />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelopeOpen className='inline mr-2 -mt-1' />Office Email Address
                                    </label>
                                    <input
                                        type="text"
                                        name="officeEmail"
                                        value={formData.officeEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Office Email Address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline -mt-1 mr-1" /> Office Telephone Number (with STD Code)
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            STD
                                        </span>
                                        <input
                                            type="tel"
                                            name="officeTelephone"
                                            value={formData.officeTelephone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter Telephone Number'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMobileScreen className="inline -mt-1 mr-1" /> Mobile Number
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="officeMobile"
                                            value={formData.officeMobile}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter Mobile Number'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaFax className="inline -mt-1 mr-1" /> Office FAX Number (with STD Code)
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                                            STD
                                        </span>
                                        <input
                                            type="tel"
                                            name="officeFax"
                                            value={formData.officeFax}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter FAX Number'
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className='space-y-2 pt-2'>
                                <div className="border-t border-gray-400" />
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div className='space-y-6'>
                                        <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaBuilding className='mt-1' /> Nature of possession of premises </h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Please Select
                                            </label>
                                            <select
                                                value={formData.possessionPremise}
                                                name="possessionPremise"
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="consent">Consent</option>
                                                <option value="leased">Leased</option>
                                                <option value="others">Others</option>
                                                <option value="own">Own</option>
                                                <option value="rented">Rented</option>
                                                <option value="shared">Shared</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='space-y-6'>
                                        <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "><FaCloudUploadAlt className='mt-1' /> Document Upload </h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            Todo
                                            {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="residentialAddress.country"
                                                value={formData.residentialAddress.country}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter Country"
                                                required
                                            />
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='space-y-2 pt-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2">
                                    <FaTruck className='mt-1' /> Nature of Business Activity being carried out at above mentioned premises
                                </h3>
                                <div className="border-t border-gray-400" />
                                <div className="grid md:grid-cols-3 gap-4">
                                    {['Bonded Warehouse', 'SOU / STP / EHTP', 'Export', 'Factory / Manufacturing', 'Import', 'Supplier of Services', 'Leasing Business', 'Office / Sale Office', 'Recipient of Goods or Services', 'Retail Business', 'Warehouse / Depot', 'Wholesale Business', 'Works Contract', 'Others (Please Specify)'].map((option, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`natureOfBusiness-${index}`}
                                                checked={formData.natureOfBusiness[index]}
                                                onChange={() => {
                                                    const updatedNatureOfBusiness = [...formData.natureOfBusiness];
                                                    updatedNatureOfBusiness[index] = !updatedNatureOfBusiness[index];
                                                    setFormData({ ...formData, natureOfBusiness: updatedNatureOfBusiness });
                                                }}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`natureOfBusiness-${index}`} className="text-gray-700">{option}</label>
                                        </div>
                                    ))}
                                </div>
                                {formData.natureOfBusiness[13] && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Please Specify
                                        </label>
                                        <input
                                            type="text"
                                            name="otherNatureOfBusiness"
                                            value={formData.otherNatureOfBusiness}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter Other Nature of Business"
                                            required={formData.natureOfBusiness[13]}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === 'goods-services' && (
                        <div className="max-w-md:space-y-6 grid md:grid-cols-2 gap-4">
                            {/* Goods Section */}
                            <div className="space-y-2">
                                <div className='space-y-2'>
                                    <div className="border-t border-gray-400" />
                                    <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "> Goods </h3>
                                    <div className="border-t border-gray-400" />
                                </div>

                                {formData.goods?.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.goods.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                                <span>{item}</span>
                                                <button
                                                    onClick={() => handleRemoveItem('goods', index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FaTimesCircle className='h-7 w-7' />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.goods.length >= 5 && <p className="text-red-600">You can add a maximum of 5 goods.</p>}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            name="newGood"
                                            value={inputValues['goods']}
                                            onChange={(e) => setInputValues({ ...inputValues, goods: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem('goods')}
                                            placeholder="Add a good"
                                            className="w-full p-2 border rounded border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleAddItem('goods')}
                                        className="bg-indigo-950 text-white p-2 rounded hover:bg-indigo-900 transition-colors max-w-fit"
                                    >
                                        <FaPlusCircle className='h-7 w-7' />
                                    </button>
                                </div>
                            </div>

                            {/* Services Section (similar structure) */}
                            <div className="space-y-2">
                                <div className='space-y-2'>
                                    <div className="border-t border-gray-400" />
                                    <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "> Services </h3>
                                    <div className="border-t border-gray-400" />
                                </div>

                                {formData.services?.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.services.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                                <span>{item}</span>
                                                <button
                                                    onClick={() => handleRemoveItem('services', index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FaTimesCircle className='h-7 w-7' />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.services.length >= 5 && <p className="text-red-600">You can add a maximum of 5 services.</p>}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            name="newService"
                                            value={inputValues['services']}
                                            onChange={(e) => setInputValues({ ...inputValues, services: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem('services')}
                                            placeholder="Add a service"
                                            className="w-full p-2 border rounded border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleAddItem('services')}
                                        className="bg-indigo-950 text-white p-2 rounded hover:bg-indigo-900 transition-colors max-w-fit"
                                    >
                                        <FaPlusCircle className='h-7 w-7' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'state-info' && (
                        <div className="space-y-6">
                            <div className='space-y-2'>
                                <div className="border-t border-gray-400" />
                                <h3 className="text-xl font-semibold text-indigo-950 flex gap-x-2 "> State Specific Information </h3>
                                <div className="border-t border-gray-400" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Professional Tax Employee Code (EC) No.
                                    </label>
                                    <input
                                        type="text"
                                        name="proTaxEmpCodeNo"
                                        value={formData.proTaxEmpCodeNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Professional Tax E.C. Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Professional Tax Registration Certificate (RC) No.
                                    </label>
                                    <input
                                        type="text"
                                        name="proTaxRegCertificateNo"
                                        value={formData.proTaxRegCertificateNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Professional Tax R.C. Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State Excise No.
                                    </label>
                                    <input
                                        type="text"
                                        name="stateExciseLicenceNo"
                                        value={formData.stateExciseLicenceNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter State Excise License Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of the person in whose name Excise License is held
                                    </label>
                                    <input
                                        type="text"
                                        name="nameExciseLicence"
                                        value={formData.nameExciseLicence}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Name of the Person in whose name Excise License is held"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={handleBack}
                            disabled={backButtonDisabled}
                            className={`px-6 py-2 rounded-lg transition-colors border flex items-center ${backButtonDisabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-300 border-slate-500'
                                }`}
                        >
                            {isFetching ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : (
                                <>
                                    <LuChevronLeft className="w-4 h-4 -ml-2 mr-2 inline" />
                                    Back
                                </>
                            )}
                        </button>
                        <button
                            onClick={activeSection === 'summary' ? handleSubmit : handleNext}
                            disabled={activeSection === "summary" ? (!isFormVerified || nextButtonDisabled) : nextButtonDisabled}
                            className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center ${(activeSection === "summary" ? (!isFormVerified || nextButtonDisabled) : nextButtonDisabled)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-700 hover:bg-blue-800'
                                }`}
                        >
                            {isSaving ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                <>
                                    {activeSection === 'summary' ? 'Submit Application' :
                                        currentStepIndex === sections.length - 2 ? 'Review Details' : 'Next Step'}
                                    {activeSection !== 'summary' && currentStepIndex < sections.length - 2 && (
                                        <LuChevronRight className="w-4 h-4 ml-2" />
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GstRegistration;