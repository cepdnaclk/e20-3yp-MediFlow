const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const axios = require("axios");

exports.getAIResponse = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch prescription data
    const prescriptionData = await Prescription.findOne({ 
      where: { patientId: patientId },
      order: [['prescriptionDate', 'DESC']] // Get the most recent prescription
    });
    
    if (!prescriptionData) {
      return res.status(404).json({ message: "Prescription data not found" });
    }

    // Fetch patient data to get gender
    const patientData = await Patient.findOne({ 
      where: { id: patientId } 
    });
    
    if (!patientData) {
      return res.status(404).json({ message: "Patient data not found" });
    }

    // Construct the prompt combining data from both models
    const prompt = `
      Patient Details:
      - ID: ${prescriptionData.patientId}
      - Age: ${prescriptionData.age}
      - Gender: ${patientData.gender}
      - Medicine: ${JSON.stringify(prescriptionData.medicines)}
      - Allergies: ${JSON.stringify(prescriptionData.allergies)}
      - Current Symptoms: ${prescriptionData.patientStatus}
      - Doctor's Comment: ${prescriptionData.doctorComments}
      - Date: ${prescriptionData.prescriptionDate}

      As a clinical assistant, please provide a concise summary (max 60 words) with likely causes, useful diagnostic tests, and treatments a doctor may consider.No need to include the patient's name or any personal information.
      Please ensure the response is in a professional tone and suitable for a medical context. Also give the response with bullet points.
    `;

    // Log the prompt for testing
    console.log('==== GEMINI API PROMPT DATA ====');
    console.log(prompt);
    console.log('===============================');

    // Send the prompt to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Return the AI response to the frontend
    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    res.status(200).json({ aiResponse });
  } catch (error) {
    console.error("Error communicating with GeminiAI:", error.message);
    res.status(500).json({ message: "Error communicating with GeminiAI", error: error.message });
  }
};