'use client'
import { useWholeApp } from '@/components/AuthContextApi';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [mockQuestionId, setMockQuestionId] = useState('');

  const { userId } = useWholeApp();
  const router = useRouter();

  // Redirect after mock test ID is generated
  useEffect(() => {
    if (mockQuestionId) {
      router.push(
        `/mock-test/${encodeURIComponent(userId)}/${encodeURIComponent(mockQuestionId)}`
      );
    }
  }, [mockQuestionId, userId]);

  const generateAImockQuest = async () => {
    try {
      if (userId && role && skills && difficulty) {
        const repos = await axios.post('/api/mockgenerator', {
          userid: userId,
          role: role,
          skill: skills,
          difficulty: difficulty
        });

        if (repos?.data?.mockTestId) {
          setMockQuestionId(repos?.data?.mockTestId);
        }
      } 
    } catch (error) {
      console.error("Error generating mock questions:", error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='text-white'>
        <input
          onChange={(e) => setRole(e.target.value)}
          className='placeholder:font-bold w-[95%] outline-none focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600 m-2 text-lg pl-2 p-1 rounded-sm'
          type="text"
          required
          placeholder='Enter role'
        />
        <input
          onChange={(e) => setSkills(e.target.value)}
          className='placeholder:font-bold w-[95%] outline-none focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600 m-2 text-lg pl-2 p-1 rounded-sm'
          type="text"
          required
          placeholder='Enter Skills'
        />

        <Select onValueChange={(value) => setDifficulty(value)} defaultValue="easy" className='dark'>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className='dark'>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role && skills && difficulty ? (
        <Button onClick={generateAImockQuest} variant="secondary">Generate Quiz</Button>
      ) : (
        <Button disabled variant="secondary">Generate Quiz</Button>
      )}
    </div>
  );
};

export default Page;



//  User role: ${role}  
//  Skills/Topics: ${skills}  
//  Difficulty: ${difficulty}