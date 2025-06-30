import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: certId } = await params;
    
    // Try to get certificate from database first
    try {
      // Since we don't have a certificates table yet, we'll create a mock response
      // In a real application, you would query your database like this:
      // const certificate = await query('SELECT * FROM certificates WHERE id = ?', [certId]);
      
      const certificateData = {
        id: certId,
        type: certId.startsWith("BC") ? "birth" : "death",
        name: certId.startsWith("BC") ? "Sample Child Name" : "Sample Patient Name",
        dateOfBirth: certId.startsWith("BC") ? "2024-01-15" : null,
        dateOfDeath: certId.startsWith("DC") ? "2024-06-20" : null,
        placeOfBirth: certId.startsWith("BC") ? "Sample City, State" : null,
        placeOfDeath: certId.startsWith("DC") ? "Sample City, State" : null,
        gender: certId.startsWith("BC") ? "Male" : null,
        status: "Approved",
        createdAt: "2024-06-20T10:00:00.000Z",
        statusUpdatedAt: "2024-06-20T10:30:00.000Z",
        statusUpdatedBy: "Civil Authority Officer",
        certificateNumber: certId,
        issuedDate: "2024-06-20",
        issuingAuthority: "Civil Registry Office",
        notes: "This is a sample certificate for demonstration purposes.",
        // Additional fields for birth certificates
        ...(certId.startsWith("BC") && {
          motherName: "Sample Mother Name",
          fatherName: "Sample Father Name",
          birthWeight: "3.2 kg",
          birthTime: "14:30",
          attendingPhysician: "Dr. Sample Doctor"
        }),
        // Additional fields for death certificates
        ...(certId.startsWith("DC") && {
          causeOfDeath: "Natural causes",
          attendingPhysician: "Dr. Sample Doctor",
          placeOfDeath: "Sample Hospital",
          timeOfDeath: "15:45",
          nextOfKin: "Sample Next of Kin"
        })
      };
      
      // Create filename
      const fileName = `${certificateData.type}_certificate_${certId}.json`;
      
      // Return the certificate data as a downloadable JSON file
      return new NextResponse(JSON.stringify(certificateData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Fallback to mock data if database query fails
      const fallbackData = {
        id: certId,
        type: certId.startsWith("BC") ? "birth" : "death",
        name: "Certificate Data Unavailable",
        status: "Data not found in database",
        certificateNumber: certId,
        notes: "This certificate data could not be retrieved from the database."
      };
      
      const fileName = `certificate_${certId}.json`;
      
      return new NextResponse(JSON.stringify(fallbackData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }
    
  } catch (error) {
    console.error('Error downloading certificate:', error);
    return NextResponse.json(
      { error: "Failed to download certificate" },
      { status: 500 }
    );
  }
} 