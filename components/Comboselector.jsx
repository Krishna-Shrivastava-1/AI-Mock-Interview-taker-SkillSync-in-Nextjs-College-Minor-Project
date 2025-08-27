'use client'
import React, { useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link';
const roles = [
  // 🌍 General Roles
  { value: "software-engineer", label: "Software Engineer" },
  { value: "fullstack-developer", label: "Full-Stack Developer" },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "mobile-developer", label: "Mobile App Developer" },
  { value: "game-developer", label: "Game Developer" },
  { value: "qa-engineer", label: "QA / Test Engineer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "site-reliability-engineer", label: "Site Reliability Engineer (SRE)" },
  { value: "cloud-engineer", label: "Cloud Engineer" },
  { value: "cybersecurity-analyst", label: "Cybersecurity Analyst" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "ml-engineer", label: "Machine Learning Engineer" },
  { value: "ai-researcher", label: "AI Researcher" },
  { value: "blockchain-developer", label: "Blockchain Developer" },
  { value: "embedded-engineer", label: "Embedded Systems Engineer" },
  { value: "system-administrator", label: "System Administrator" },
  { value: "network-engineer", label: "Network Engineer" },

  // 🎨 Frontend Specializations
  { value: "react-developer", label: "React Developer" },
  { value: "angular-developer", label: "Angular Developer" },
  { value: "vue-developer", label: "Vue Developer" },
  { value: "nextjs-developer", label: "Next.js Developer" },
  { value: "ui-ux-designer", label: "UI/UX Designer" },
  { value: "web-designer", label: "Web Designer" },

  // ⚙️ Backend Specializations
  { value: "nodejs-developer", label: "Node.js Developer" },
  { value: "django-developer", label: "Django Developer" },
  { value: "flask-developer", label: "Flask Developer" },
  { value: "spring-boot-developer", label: "Spring Boot Developer" },
  { value: "dotnet-developer", label: ".NET Developer" },
  { value: "golang-developer", label: "Go Developer" },
  { value: "php-laravel-developer", label: "PHP / Laravel Developer" },
  { value: "ruby-on-rails-developer", label: "Ruby on Rails Developer" },

  // 📊 Data & AI
  { value: "sql-developer", label: "SQL Developer" },
  { value: "big-data-engineer", label: "Big Data Engineer" },
  { value: "etl-developer", label: "ETL Developer" },
  { value: "nlp-engineer", label: "NLP Engineer" },
  { value: "cv-engineer", label: "Computer Vision Engineer" },
  { value: "ai-product-manager", label: "AI Product Manager" },

  // ☁️ Cloud & DevOps
  { value: "aws-engineer", label: "AWS Engineer" },
  { value: "azure-engineer", label: "Azure Engineer" },
  { value: "gcp-engineer", label: "Google Cloud Engineer" },
  { value: "kubernetes-engineer", label: "Kubernetes Engineer" },
  { value: "docker-specialist", label: "Docker Specialist" },
  { value: "ci-cd-engineer", label: "CI/CD Engineer" },

  // 🔒 Cybersecurity
  { value: "security-engineer", label: "Security Engineer" },
  { value: "ethical-hacker", label: "Ethical Hacker" },
  { value: "penetration-tester", label: "Penetration Tester" },
  { value: "forensics-analyst", label: "Forensics Analyst" },
  { value: "compliance-specialist", label: "Compliance Specialist" },

  // 📱 Mobile
  { value: "android-developer", label: "Android Developer" },
  { value: "ios-developer", label: "iOS Developer" },
  { value: "flutter-developer", label: "Flutter Developer" },
  { value: "react-native-developer", label: "React Native Developer" },
  { value: "unity-developer", label: "Unity Game Developer" },

  // 🏗️ Emerging Tech
  { value: "iot-engineer", label: "IoT Engineer" },
  { value: "vr-ar-developer", label: "VR/AR Developer" },
  { value: "quantum-computing-researcher", label: "Quantum Computing Researcher" },
  { value: "robotics-engineer", label: "Robotics Engineer" },

  // 📋 Non-Dev Roles (Tech)
  { value: "product-manager", label: "Product Manager" },
  { value: "project-manager", label: "Project Manager" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "scrum-master", label: "Scrum Master" },
  { value: "tech-support-engineer", label: "Tech Support Engineer" },
];

const Comboselector = ({parentSelectedRole}) => {

const [selectedRole, setselectedRole] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [open, setOpen] = useState(false); // State for Popover

const handleRoleChange = (val)=>{
setselectedRole(val.value)
parentSelectedRole(val.label)
}
console.log(selectedRole)
    return (
        <div>
            <Popover className='dark' open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-auto  justify-between text-white dark"
                    >
                        {selectedRole
                            ? roles.find((role) => role.value === selectedRole)?.label
                            : "Select a role"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto dark  p-0 shadow-lg shadow-zinc-800">
                    <Command>
                        <CommandInput placeholder="Search Role..." />
                        <CommandList className='noside'>
                            <CommandEmpty>No Role Found.</CommandEmpty>
                            <CommandGroup>

                                {roles.map((role) => (
                                  
                                        <CommandItem
                                            key={role.value}
                                            onSelect={() => {
                                                handleRoleChange(role);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-4 ${role?.value === selectedRole ? 'opacity-100' :'opacity-0'}`}
                                            />

                                            {role.label.split('-').join(' ')}



                                        </CommandItem>
                                 
                                ))}

                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Comboselector