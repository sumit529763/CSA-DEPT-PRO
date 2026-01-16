// import React from "react";
// import "./Faculty.css";


// import hodPic from "../../assets/images/hod-pic.jpeg"; 
// import soumyaPic from "../../assets/images/hod-pic.jpeg"; 


// // Placeholder for staff members without an assigned photo
// const PLACEHOLDER = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
//   `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#eef4ff' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#3b5998' font-size='18'>Photo</text></svg>`
// );


// export default function Faculty() {
//   
//   // 2. ASSIGN UNIQUE PHOTO TO EACH STAFF MEMBER
//   const staff = [
//     { 
//       name: "Prof. Satya Narayan Dash", 
//       title: "HOD, Professor", 
//       email: "hodcsa@giet.edu",
//       photo: hodPic
//     },
//     { 
//       name: "Ms. Soumya Ranjan Mishra", 
//       title: "Assistant Professor", 
//       email: "soumyaranjan@giet.edu",
//       // photo: soumyaPic
//     },
//     {
//         name: "Placeholder Staff",
//         title: "Lecturer",
//         email: "placeholder@giet.edu",
//         photo: null 
//     }
//   ];

//   return (
//     <main>
//       <section className="container" style={{ padding: "36px 0" }}>
//         <h2 className="section-heading">Faculty</h2>
//         <p className="section-subtitle">Meet our experienced teaching staff.</p>

//         <div className="gallery-grid" style={{ marginTop: 16 }}>
//           {staff.map((s, i) => (
//             <div key={i} className="gallery-item">
//               <img src={s.photo || PLACEHOLDER} alt={s.name} /> 
//               <div style={{ padding: "8px" }}>
//                 <strong>{s.name}</strong>
//                 <div style={{ fontSize: 0.9 + "rem", color: "var(--muted)" }}>{s.title}</div>
//                 <div style={{ fontSize: 0.85 + "rem" }}>{s.email}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }









// src/pages/Faculty/Faculty.jsx
import React from 'react';
import SectionTitle from '../../components/UI/SectionTitle';
import Card from '../../components/UI/Card';
import './Faculty.css';

import hodpic from '../../assets/images/hod-pic.jpeg'

// Mock data: In the future, this will come from MongoDB
const facultyData = {
  hod: {
    name: "Prof. Satya Narayan Dash",
    designation: "Head of Department",
    qualification: "Ph.D. in Computer Science",
    specialization: "Artificial Intelligence & Soft Computing",
    experience: "18+ Years",
    image: hodpic, // Using your existing assets path
    email: "hod.csa@giet.edu"
  },
  teachingStaff: [
    {
      id: 1,
      name: "Ms. Soumya Ranjan Mishra",
      designation: "Assistant Professor",
      specialization: "Database Management & SQL",
      image: hodpic, 
      email: "soumyaranjan@giet.edu"
    },
    {
      id: 2,
      name: "Placeholder Staff",
      designation: "Associate Professor",
      specialization: "Machine Learning & Python",
      image: hodpic,
      email: "staff2@giet.edu"
    },
    {
      id: 3,
      name: "Placeholder Staff",
      designation: "Assistant Professor",
      specialization: "Web Technologies & React",
      image: hodpic,
      email: "staff3@giet.edu"
    }
  ]
};

export default function Faculty() {
  return (
    <div className="faculty-page container section-padding">
      <SectionTitle 
        title="Our Faculty" 
        subtitle="Meet the experienced educators leading the next generation of tech innovators" 
      />

      {/* 👑 HOD Section */}
      <div className="hod-section">
        <div className="hod-card">
          <div className="hod-image-container">
            <img src={facultyData.hod.image} alt={facultyData.hod.name} />
          </div>
          <div className="hod-info">
            <span className="hod-badge">Leadership</span>
            <h2 className="hod-name">{facultyData.hod.name}</h2>
            <p className="hod-designation">{facultyData.hod.designation}</p>
            <p className="hod-qualification"><strong>Education:</strong> {facultyData.hod.qualification}</p>
            <p className="hod-spec"><strong>Focus:</strong> {facultyData.hod.specialization}</p>
            <div className="hod-contact">
              <a href={`mailto:${facultyData.hod.email}`} className="contact-link">
                <i className="fas fa-envelope"></i> {facultyData.hod.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 👨‍🏫 Teaching Staff Grid */}
      <h3 className="sub-section-heading">Faculty Members</h3>
      <div className="faculty-grid">
        {facultyData.teachingStaff.map((member) => (
          <Card key={member.id} className="faculty-card">
            <div className="faculty-img-wrapper">
              <img src={member.image} alt={member.name} />
              <div className="faculty-overlay">
                <a href={`mailto:${member.email}`} title="Email Profile"><i className="fas fa-envelope"></i></a>
                <a href="#" title="LinkedIn Profile"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="faculty-details">
              <h4 className="faculty-name">{member.name}</h4>
              <p className="faculty-rank">{member.designation}</p>
              <span className="faculty-specialty">{member.specialization}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}