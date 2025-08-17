import React from 'react'
import SpotlightCard from './SpotlightCard'
import StarBorder from './StarBorder'
import { useWholeApp } from './AuthContextApi'

const MockDataCards = ({ fetchedUser }) => {
    // const { fetchedUserData } = useWholeApp()
    if (!fetchedUser?.user) {
        // Return a loading state or null if the data isn't available yet
        return <div>Loading...</div>;
    }
    const allScores = fetchedUser?.user?.mockAttempts.map((e) => e.score)
    // console.log('allscore num - ', allScores)
    // console.log('allscore num len - ', allScores.length)
    const validScores = allScores.filter(score => typeof score === 'number');
    // console.log('validScores - ', validScores.length)
    const additionOfTotalScore = validScores.reduce((acc, curr) => acc + curr, 0)
    // console.log(additionOfTotalScore)
    //    console.log(allScores.length - validScores.length)
    return (
        <div className='flex items-center justify-center flex-wrap gap-4 mt-4'>

            <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all duration-300 shadow-cyan-500 text-white" spotlightColor="#024f61">
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between text-cyan-500'>  <h1 className='font-bold text-2xl'>Total Mock Test</h1>
                        <p className='text-muted-foreground'>Total mock test given by you.</p></div>

                    <div>
                        <h1 className='font-bold text-2xl text-cyan-500'>{fetchedUser?.user?.mockAttempts.length}</h1>
                    </div>
                </div>
            </SpotlightCard>
            <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all duration-300 shadow-green-500 text-white" spotlightColor="#02610a">
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between text-green-600'>  <h1 className='font-bold text-2xl'>Total Score</h1>
                        <p className='text-muted-foreground'>Total mock test score given by you.</p></div>

                    <div>
                        <h1 className='font-bold text-2xl text-green-600'>{additionOfTotalScore}</h1>
                    </div>
                </div>
            </SpotlightCard>
            <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all  duration-300 shadow-yellow-500 text-white" spotlightColor="#446102">
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between text-yellow-500'>  <h1 className='font-bold text-2xl'>Incomplete Mock Test</h1>
                        <p className='text-muted-foreground'>Total mock test that you you not submitted.</p></div>

                    <div>
                        <h1 className='font-bold text-2xl text-yellow-500'>{allScores.length - validScores.length}</h1>
                    </div>
                </div>
            </SpotlightCard>


        </div>
    )
}

export default MockDataCards
