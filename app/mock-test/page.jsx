'use client'
import { AppSidebar } from '@/components/app-sidebar';
import { useWholeApp } from '@/components/AuthContextApi';
import Comboselector from '@/components/Comboselector';
import GetisOpenOrNot from '@/components/GetisOpenOrNot';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import axios from 'axios';
import { Dot, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { fetchedUserData, userId, setfetchedUserData,sideBarOpen } = useWholeApp();
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [mockQuestionId, setMockQuestionId] = useState('');
  const [loading, setloading] = useState(false)

  const router = useRouter();
  useEffect(() => {
    if (fetchedUserData?.user?.skills) {
      // If user skills are available, update the local state
      setSkills(fetchedUserData.user.skills.join(', '));
    } else {
      // If no skills are available, reset the state
      setSkills('');
    }
  }, [fetchedUserData]);
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
        setloading(true)
        const repos = await axios.post('/api/mockgenerator', {
          userid: userId,
          role: role,
          skill: skills,
          difficulty: difficulty
        });

        if (repos?.data?.mockTestId) {
          setMockQuestionId(repos?.data?.mockTestId);
          setloading(true)
        }
      }
    } catch (error) {
      console.error("Error generating mock questions:", error.message);
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    router.push('/')
    setfetchedUserData([])
    router.refresh()
  }
  console.log('api role to send', role)
  return (
    <div>
      {/* <Navbar /> */}
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2  border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
            <div className="flex items-center gap-2 px-3 w-full">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className='w-full flex items-center  justify-between'>
 {
                  !sideBarOpen &&
                  <Link href={'/'}>
                  
<h1 className='text-white font-semibold cursor-pointer select-none text-xl'>SkillSync</h1>
                  </Link>
                }
                 <Link href={'/'}>
                                  
                <h1 className='text-white md:hidden block font-semibold cursor-pointer select-none text-xl'>SkillSync</h1>
                                  </Link>
                {/* <Button onClick={handleLogout} className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button> */}
              </div>
              {/* <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="#">
                            Building Your Application
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb> */}
            </div>
          </header>
              <GetisOpenOrNot />
          {!loading ?
            <div>
              <div className='w-full flex items-center justify-center'>
                <div className='text-white w-[90%] sm:w-[70%]'>
                  <h1 className='text-xl font-bold'>Guidelines:</h1>

                  <span className='flex items-start justify-center'><Dot size={50} /><p> Please provide your role, skills, and difficulty level to generate a mock test. The AI will create questions based on the provided information.</p></span>
                  <span className='flex items-start justify-center text-red-500'><Dot size={50} /><p className='text-red-500'> Note: If you leave the quiz in middle after started you will not able to continue the quiz again and this affect your overall average and score.</p></span>


                </div>
              </div>
              <div className='w-full flex items-start  justify-center text-white'>


                <div className=' m-2  w-full border h-[325px]  border-zinc-800  p-2 rounded-xl max-w-md text-white'>

                  <div className='flex flex-col w-full justify-center  '>

                    <div className="flex flex-1 flex-col  gap-4 p-4 w-full">
                      <div className='text-white w-full'>
                      
                        <Label htmlFor='role' className='text-lg font-semibold'>Role</Label>
                          <Comboselector id='role' parentSelectedRole={setRole} />
                        {/* <input
                          id='role'
                          onChange={(e) => setRole(e.target.value)}
                          className='placeholder:font-bold w-full outline-none focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600 m-2 text-lg pl-2 p-1 rounded-sm'
                          type="text"
                          required
                          placeholder='Enter role'
                        /> */}
                        <Label htmlFor='skill' className='text-lg font-semibold'>Skill</Label>
                        <input
                          id='skill'
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className='placeholder:font-bold w-full outline-none focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600 m-2 text-lg pl-2 p-1 rounded-sm'
                          type="text"
                          required
                          placeholder='Enter Skills'
                        />
                        <Label htmlFor='difficulty' className='text-lg font-semibold'>Difficulty</Label>
                        <Select onValueChange={(value) => setDifficulty(value)} defaultValue="easy" className='dark'>
                          <SelectTrigger id='difficulty' className="w-[180px]">
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
                        <Button className='hover:cursor-pointer' onClick={generateAImockQuest} variant="secondary">Generate Quiz</Button>
                      ) : (
                        <Button disabled className='hover:cursor-not-allowed select-none' variant="secondary">Generate Quiz</Button>
                      )}

                    </div>

                  </div>



                </div>
              </div>
            </div>
            :
            <div className='w-full text-white flex items-center justify-center h-[70vh]'>
              <LoaderCircle size={45} className='animate-spin' />
            </div>

          }

        </SidebarInset>
      </SidebarProvider>

    </div>
  );
};

export default Page;



//  User role: ${role}  
//  Skills/Topics: ${skills}  
//  Difficulty: ${difficulty}