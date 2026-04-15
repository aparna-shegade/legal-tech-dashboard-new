const router = require("express").Router();
const Client = require("../models/Client");
const Case = require("../models/Case");
const Task = require("../models/Task");
const Document = require("../models/Document");

// SEED DATABASE WITH DEMO DATA
router.post("/seed", async (req, res) => {
  try {
    // Clear existing data
    await Client.deleteMany({});
    await Case.deleteMany({});
    await Task.deleteMany({});
    await Document.deleteMany({});

    // Create sample clients
    const clients = await Client.insertMany([
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        address: "123 Legal Ave, New York, NY 10001"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1-555-0124",
        address: "456 Law Street, Los Angeles, CA 90001"
      },
      {
        name: "ABC Corporation",
        email: "contact@abccorp.com",
        phone: "+1-555-0125",
        address: "789 Business Plaza, Chicago, IL 60601"
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1-555-0126",
        address: "321 Court Lane, Houston, TX 77001"
      },
      {
        name: "Tech Innovations Inc",
        email: "legal@techinnovations.com",
        phone: "+1-555-0127",
        address: "654 Tech Drive, Silicon Valley, CA 94025"
      }
    ]);

    // Create sample cases
    const cases = await Case.insertMany([
      {
        caseTitle: "Smith v. Johnson",
        clientId: clients[0]._id,
        caseType: "Civil",
        status: "Ongoing",
        startDate: new Date("2024-01-15"),
        nextHearingDate: new Date("2024-04-20"),
        priority: "High",
        description: "Contract dispute regarding service agreement terms"
      },
      {
        caseTitle: "Estate Planning Matter",
        clientId: clients[1]._id,
        caseType: "Estate",
        status: "Pending",
        startDate: new Date("2024-02-01"),
        nextHearingDate: new Date("2024-05-10"),
        priority: "Medium",
        description: "Will preparation and estate management"
      },
      {
        caseTitle: "ABC Corp Merger",
        clientId: clients[2]._id,
        caseType: "Corporate",
        status: "Ongoing",
        startDate: new Date("2023-11-01"),
        nextHearingDate: new Date("2024-03-30"),
        priority: "High",
        description: "Corporate merger and acquisition documentation"
      },
      {
        caseTitle: "Intellectual Property Dispute",
        clientId: clients[3]._id,
        caseType: "IP",
        status: "Closed",
        startDate: new Date("2023-06-01"),
        nextHearingDate: new Date("2024-02-15"),
        priority: "Medium",
        description: "Patent infringement case"
      },
      {
        caseTitle: "Employment Contract Review",
        clientId: clients[4]._id,
        caseType: "Employment",
        status: "Pending",
        startDate: new Date("2024-02-20"),
        nextHearingDate: new Date("2024-06-01"),
        priority: "Low",
        description: "Review and negotiation of employment agreements"
      },
      {
        caseTitle: "Real Estate Transaction",
        clientId: clients[0]._id,
        caseType: "Real Estate",
        status: "Ongoing",
        startDate: new Date("2024-01-10"),
        nextHearingDate: new Date("2024-04-15"),
        priority: "Medium",
        description: "Commercial property purchase and lease agreement"
      }
    ]);

    // Create sample tasks
    const tasks = await Task.insertMany([
      {
        caseId: cases[0]._id,
        taskTitle: "Review contract documents",
        dueDate: new Date("2024-04-01"),
        status: "Completed",
        completionPercentage: 100
      },
      {
        caseId: cases[0]._id,
        taskTitle: "Prepare witness statement",
        dueDate: new Date("2024-04-10"),
        status: "Pending",
        completionPercentage: 45
      },
      {
        caseId: cases[1]._id,
        taskTitle: "Draft will document",
        dueDate: new Date("2024-05-01"),
        status: "Completed",
        completionPercentage: 100
      },
      {
        caseId: cases[2]._id,
        taskTitle: "Compile merger documentation",
        dueDate: new Date("2024-03-20"),
        status: "Completed",
        completionPercentage: 100
      },
      {
        caseId: cases[2]._id,
        taskTitle: "Schedule acquisition meeting",
        dueDate: new Date("2024-03-25"),
        status: "Pending",
        completionPercentage: 70
      },
      {
        caseId: cases[3]._id,
        taskTitle: "File patent settlement",
        dueDate: new Date("2024-02-01"),
        status: "Completed",
        completionPercentage: 100
      },
      {
        caseId: cases[4]._id,
        taskTitle: "Review employment terms",
        dueDate: new Date("2024-04-01"),
        status: "Pending",
        completionPercentage: 30
      },
      {
        caseId: cases[5]._id,
        taskTitle: "Title search and verification",
        dueDate: new Date("2024-03-31"),
        status: "Completed",
        completionPercentage: 100
      }
    ]);

    // Create sample documents
    const documents = await Document.insertMany([
      {
        caseId: cases[0]._id,
        documentName: "Service Agreement",
        documentType: "Contract",
        status: "Approved"
      },
      {
        caseId: cases[0]._id,
        documentName: "Damages Assessment Report",
        documentType: "Report",
        status: "Reviewed"
      },
      {
        caseId: cases[1]._id,
        documentName: "Last Will and Testament",
        documentType: "Legal Document",
        status: "Approved"
      },
      {
        caseId: cases[1]._id,
        documentName: "Trust Document",
        documentType: "Legal Document",
        status: "Pending"
      },
      {
        caseId: cases[2]._id,
        documentName: "Merger Agreement",
        documentType: "Agreement",
        status: "Approved"
      },
      {
        caseId: cases[2]._id,
        documentName: "Due Diligence Report",
        documentType: "Report",
        status: "Approved"
      },
      {
        caseId: cases[3]._id,
        documentName: "Patent Claim Analysis",
        documentType: "Report",
        status: "Approved"
      },
      {
        caseId: cases[4]._id,
        documentName: "Employment Agreement",
        documentType: "Contract",
        status: "Reviewed"
      },
      {
        caseId: cases[5]._id,
        documentName: "Property Title Deed",
        documentType: "Title Document",
        status: "Approved"
      },
      {
        caseId: cases[5]._id,
        documentName: "Lease Agreement",
        documentType: "Agreement",
        status: "Pending"
      }
    ]);

    res.json({
      message: "Database seeded successfully",
      data: {
        clientsCount: clients.length,
        casesCount: cases.length,
        tasksCount: tasks.length,
        documentsCount: documents.length
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
