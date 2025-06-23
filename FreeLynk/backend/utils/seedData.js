const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const bcrypt = require('bcryptjs');

// Sample data arrays
const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    role: 'Client',
    skills: ['Project Management', 'Business Strategy'],
    bio: 'Experienced business owner looking for talented developers.',
    hourlyRate: 0,
    completedProjects: 0
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'Client',
    skills: ['Marketing', 'Content Strategy'],
    bio: 'Marketing consultant seeking creative professionals.',
    hourlyRate: 0,
    completedProjects: 0
  },
  {
    name: 'Mike Chen',
    email: 'mike@example.com',
    password: 'password123',
    role: 'Client',
    skills: ['Product Management', 'UX Design'],
    bio: 'Product manager building innovative solutions.',
    hourlyRate: 0,
    completedProjects: 0
  },
  {
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    password: 'password123',
    role: 'Freelancer',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    bio: 'Full-stack developer with 5+ years of experience building modern web applications.',
    hourlyRate: 45,
    completedProjects: 12,
    rating: 4.8,
    totalEarnings: 25000
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    role: 'Freelancer',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    bio: 'Creative UI/UX designer passionate about user-centered design.',
    hourlyRate: 35,
    completedProjects: 8,
    rating: 4.9,
    totalEarnings: 18000
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    password: 'password123',
    role: 'Freelancer',
    skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    bio: 'Data scientist specializing in machine learning and AI solutions.',
    hourlyRate: 60,
    completedProjects: 15,
    rating: 4.7,
    totalEarnings: 35000
  },
  {
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    password: 'password123',
    role: 'Freelancer',
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing'],
    bio: 'Professional content writer with expertise in SEO and digital marketing.',
    hourlyRate: 25,
    completedProjects: 20,
    rating: 4.6,
    totalEarnings: 15000
  },
  {
    name: 'Tom Wilson',
    email: 'tom@example.com',
    password: 'password123',
    role: 'Freelancer',
    skills: ['Mobile Development', 'React Native', 'iOS', 'Android'],
    bio: 'Mobile app developer creating cross-platform solutions.',
    hourlyRate: 50,
    completedProjects: 10,
    rating: 4.8,
    totalEarnings: 22000
  }
];

const sampleProjects = [
  {
    title: 'E-commerce Website Development',
    description: 'Need a modern e-commerce website with payment integration, user authentication, and admin dashboard. The site should be responsive and optimized for mobile devices.',
    budget: 5000,
    category: 'Web Development',
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Open',
    views: 45
  },
  {
    title: 'Mobile App for Food Delivery',
    description: 'Looking for a React Native developer to build a food delivery app with real-time tracking, push notifications, and payment processing.',
    budget: 8000,
    category: 'Mobile Development',
    skills: ['React Native', 'Firebase', 'Google Maps API', 'Payment Gateway'],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'Open',
    views: 32
  },
  {
    title: 'Brand Identity Design',
    description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.',
    budget: 2000,
    category: 'Design',
    skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Typography'],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'Open',
    views: 28
  },
  {
    title: 'Content Marketing Strategy',
    description: 'Seeking a content marketing expert to develop a comprehensive content strategy, create blog posts, and manage social media presence.',
    budget: 3000,
    category: 'Marketing',
    skills: ['Content Strategy', 'SEO', 'Social Media Marketing', 'Blog Writing'],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'Open',
    views: 19
  },
  {
    title: 'Data Analysis Dashboard',
    description: 'Need a Python developer to build a data analysis dashboard that visualizes sales data and provides insights for business decisions.',
    budget: 4000,
    category: 'Data Science',
    skills: ['Python', 'Pandas', 'Matplotlib', 'Dashboard Development'],
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'Open',
    views: 23
  },
  {
    title: 'Website Redesign',
    description: 'Looking to redesign our company website with modern UI/UX, improved navigation, and better conversion optimization.',
    budget: 3500,
    category: 'Web Development',
    skills: ['UI/UX Design', 'HTML/CSS', 'JavaScript', 'WordPress'],
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    status: 'In Progress',
    views: 67
  },
  {
    title: 'Technical Documentation',
    description: 'Need a technical writer to create comprehensive documentation for our software product including user guides and API documentation.',
    budget: 1500,
    category: 'Writing',
    skills: ['Technical Writing', 'Documentation', 'API Documentation', 'User Guides'],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'Completed',
    views: 41
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Bid.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Create projects
    const createdProjects = [];
    const clients = createdUsers.filter(user => user.role === 'Client');
    
    for (let i = 0; i < sampleProjects.length; i++) {
      const projectData = sampleProjects[i];
      const client = clients[i % clients.length];
      
      const project = new Project({
        ...projectData,
        postedBy: client._id
      });
      await project.save();
      createdProjects.push(project);
      console.log(`✅ Created project: ${project.title}`);
    }

    // Create bids
    const freelancers = createdUsers.filter(user => user.role === 'Freelancer');
    const openProjects = createdProjects.filter(project => project.status === 'Open');
    
    for (const project of openProjects) {
      const numBids = Math.floor(Math.random() * 3) + 2;
      const projectFreelancers = [...freelancers].sort(() => 0.5 - Math.random()).slice(0, numBids);
      
      for (const freelancer of projectFreelancers) {
        const bidAmount = Math.floor(project.budget * (0.7 + Math.random() * 0.6));
        const estimatedDays = Math.floor(project.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
        const actualDays = Math.max(7, Math.floor(estimatedDays * 0.8));
        
        const bid = new Bid({
          project: project._id,
          freelancer: freelancer._id,
          amount: bidAmount,
          proposal: `I have extensive experience in ${project.skills.join(', ')}. I can deliver this project within ${actualDays} days with high quality and regular communication.`,
          estimatedDays: actualDays,
          status: 'Pending'
        });
        await bid.save();
        console.log(`✅ Created bid: ${freelancer.name} -> ${project.title} ($${bidAmount})`);
      }
    }

    // Accept some bids
    const pendingBids = await Bid.find({ status: 'Pending' }).populate('project freelancer');
    
    const inProgressProject = createdProjects.find(p => p.status === 'In Progress');
    if (inProgressProject) {
      const projectBid = pendingBids.find(bid => bid.project._id.toString() === inProgressProject._id.toString());
      if (projectBid) {
        projectBid.status = 'Accepted';
        await projectBid.save();
        
        inProgressProject.status = 'In Progress';
        inProgressProject.acceptedBid = projectBid._id;
        await inProgressProject.save();
        
        console.log(`✅ Accepted bid for: ${inProgressProject.title}`);
      }
    }

    const completedProject = createdProjects.find(p => p.status === 'Completed');
    if (completedProject) {
      const projectBid = pendingBids.find(bid => bid.project._id.toString() === completedProject._id.toString());
      if (projectBid) {
        projectBid.status = 'Accepted';
        await projectBid.save();
        
        completedProject.status = 'Completed';
        completedProject.acceptedBid = projectBid._id;
        await completedProject.save();
        
        console.log(`✅ Accepted bid for: ${completedProject.title}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users, ${createdProjects.length} projects, and ${await Bid.countDocuments()} bids`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase }; 