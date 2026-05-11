import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { VendorJobRequest, Appointment, VendorStatus, Notification, UserMessage, VendorProfile } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- STATE ---
  let jobs: VendorJobRequest[] = [
    {
      id: "j1",
      token: "demo-token",
      propertyId: "p1",
      serviceId: "s1",
      vendorId: "v1",
      vendorName: "Snapshot Pro",
      serviceName: "Real Estate Photography",
      propertyAddress: "4502 Scenic View Dr, Austin, TX",
      durationMinutes: 120,
      sellerAvailability: "Mon-Wed: 9am-12pm\nThu: After 2pm",
      priority: "High",
      status: "New Request",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    },
    {
        id: "j2",
        token: "token-2",
        propertyId: "p2",
        serviceId: "s2",
        vendorId: "v1",
        vendorName: "Snapshot Pro",
        serviceName: "3D Virtual Tour",
        propertyAddress: "128 Golden Gate Dr, Hill Country, TX",
        durationMinutes: 90,
        sellerAvailability: "Friday: All Day",
        priority: "Normal",
        status: "Availability Submitted",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 172800000).toISOString(),
    }
  ];

  let appointments: Appointment[] = [
    {
      id: "a1",
      jobId: "j3",
      vendorId: "v1",
      propertyAddress: "782 Spruce Lane, Austin, TX",
      serviceName: "Drone Videography",
      confirmedStart: new Date(Date.now() + 3600000 * 2).toISOString(),
      confirmedEnd: new Date(Date.now() + 3600000 * 4).toISOString(),
      status: "Scheduled",
      accessNotes: "Gate code 1234. Owner will leave back door unlocked.",
      sellerNotes: "Please capture the new pool deck specifically."
    },
    {
        id: "a2",
        jobId: "j4",
        vendorId: "v1",
        propertyAddress: "15 North Blvd, Austin, TX",
        serviceName: "Standard Photography",
        confirmedStart: new Date(Date.now() - 3600000 * 24).toISOString(),
        confirmedEnd: new Date(Date.now() - 3600000 * 22).toISOString(),
        status: "Completed"
    }
  ];

  let notifications: Notification[] = [
    { id: "n1", title: "New Job Request", message: "A photography request is waiting for your availability.", type: "info", createdAt: new Date().toISOString(), read: false },
    { id: "n2", title: "Appointment Confirmed", message: "782 Spruce Lane has been confirmed for tomorrow.", type: "success", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true }
  ];

  let messages: UserMessage[] = [
    { id: "m1", jobId: "j3", sender: "Agent", content: "Hey, the seller is a bit nervous about the drone, can you explain the process when you arrive?", timestamp: new Date(Date.now() - 10000000).toISOString() }
  ];

  let profile: VendorProfile = {
      id: "v1",
      businessName: "Snapshot Pro Media",
      contactName: "David Miller",
      email: "work.uditbhatnagar@gmail.com",
      phone: "(512) 555-0192",
      bio: "High-performance real estate media coordination for modern agencies. Specializing in luxury photography, cinematic videography, and immersive 3D tours.",
      website: "https://snapshotpro.media",
      yearsExperience: 12,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
      logoUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      serviceTypes: ["Photography", "Videography", "3D Tours"],
      operatingAreas: ["Austin, TX", "Hill Country, TX", "Round Rock, TX"],
      
      services: [
        { type: "Photography", enabled: true, basePrice: 250, estimatedDurationMinutes: 60, turnaroundTimeHours: 24 },
        { type: "Videography", enabled: true, basePrice: 450, estimatedDurationMinutes: 120, turnaroundTimeHours: 48 },
        { type: "3D Tours", enabled: true, basePrice: 150, estimatedDurationMinutes: 45, turnaroundTimeHours: 12 }
      ],
      
      pricing: {
        minPrice: 350,
        maxPrice: 650,
        model: 'package',
        travelFee: 25,
        rushFee: 100,
        weekendFee: 50
      },
      
      availability: {
        workingHours: {
          monday: { start: "08:00", end: "18:00", enabled: true },
          tuesday: { start: "08:00", end: "18:00", enabled: true },
          wednesday: { start: "08:00", end: "18:00", enabled: true },
          thursday: { start: "08:00", end: "18:00", enabled: true },
          friday: { start: "08:00", end: "18:00", enabled: true },
          saturday: { start: "10:00", end: "14:00", enabled: false },
          sunday: { start: "10:00", end: "14:00", enabled: false }
        },
        vacationMode: false,
        timezone: "America/Chicago",
        blockedDates: [],
        maxJobsPerDay: 4
      },
      
      performance: {
        completedJobs: 312,
        onTimePercentage: 98,
        cancellationRate: 1,
        avgResponseTimeMinutes: 45,
        ratingAverage: 4.9
      },
      
      portfolio: [
        { id: "m1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", type: 'portfolio', order: 1 },
        { id: "m2", url: "https://images.unsplash.com/photo-1600607687940-4e524cb35a3a", type: 'portfolio', order: 2 }
      ],
      
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        scheduling: {
          minNoticeHours: 24,
          bufferMinutes: 30,
          acceptWeekend: false,
          acceptRecurring: true
        },
        communication: {
          preferredMethod: 'app',
          autoRespond: true
        }
      },
      
      status: 'Active'
  };

  // --- API ---

  app.get("/api/vendor/dashboard", (req, res) => {
    res.json({
        stats: {
            pendingRequests: jobs.filter(j => j.status === 'New Request').length,
            upcomingJobs: appointments.filter(a => a.status === 'Scheduled').length,
            completedThisMonth: appointments.filter(a => a.status === 'Completed').length,
            unreadNotifications: notifications.filter(n => !n.read).length
        },
        todaySchedule: appointments.filter(a => {
            const start = new Date(a.confirmedStart);
            const today = new Date();
            return start.toDateString() === today.toDateString();
        }),
        recentActivity: notifications.slice(0, 5)
    });
  });

  app.get("/api/vendor/jobs", (req, res) => res.json(jobs));
  app.get("/api/vendor/job/:id", (req, res) => res.json(jobs.find(j => j.id === req.params.id || j.token === req.params.id)));
  
  app.get("/api/vendor/appointments", (req, res) => res.json(appointments));
  
  app.post("/api/vendor/job/:id/availability", (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (job) job.status = "Availability Submitted";
    res.json({ success: true });
  });

  app.post("/api/vendor/job/:id/decline", (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (job) job.status = "Declined";
    res.json({ success: true });
  });

  app.post("/api/vendor/appointment/:id/status", (req, res) => {
    const appt = appointments.find(a => a.id === req.params.id);
    if (appt) appt.status = req.body.status as VendorStatus;
    res.json({ success: true });
  });

  app.get("/api/vendor/profile", (req, res) => res.json(profile));
  app.put("/api/vendor/profile", (req, res) => { profile = { ...profile, ...req.body }; res.json(profile); });

  app.get("/api/vendor/notifications", (req, res) => res.json(notifications));
  app.post("/api/vendor/notifications/read", (req, res) => { 
    notifications = notifications.map(n => ({ ...n, read: true })); 
    res.json({ success: true }); 
  });

  // --- VITE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
