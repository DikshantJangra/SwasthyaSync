'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth/client";

export default function Dashboard() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    
    // tRPC Queries
    const { data: metrics, isLoading: metricsLoading, refetch } = trpc.health.getMetrics.useQuery(undefined, {
        enabled: !!session?.user,
    });

    // tRPC Mutations
    const logMetricMutation = trpc.health.logMetric.useMutation({
        onSuccess: () => {
            refetch();
            setEditing(null);
        }
    });

    const [upcomingMeetups, setUpcomingMeetups] = useState<{ doctor: string; date: string }[]>([]);
    
    // Local derived state from tRPC data
    const todayHydration = metrics?.find(m => m.type === 'hydration')?.value ?? null;
    const height = metrics?.find(m => m.type === 'height')?.value ?? null;
    const weight = metrics?.find(m => m.type === 'weight')?.value ?? null;
    const blood = metrics?.find(m => m.type === 'blood_pressure' || (m as any).type === 'blood')?.value ?? null;

    useEffect(() => {
        setUpcomingMeetups([
            { doctor: "Dr. Sharma", date: new Date(Date.now() + 86400000).toISOString() },
            { doctor: "Dr. Gupta", date: new Date(Date.now() + 172800000).toISOString() }
        ]);
    }, []);

    const [editing, setEditing] = useState<string | null>(null);
    const [inputHeight, setInputHeight] = useState('');
    const [inputWeight, setInputWeight] = useState('');
    const [inputBlood, setInputBlood] = useState('');

    const handleSubmitHeight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputHeight) {
            logMetricMutation.mutate({ type: 'height', value: Number(inputHeight) });
            setInputHeight('');
        }
    };
    const handleSubmitWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputWeight) {
            logMetricMutation.mutate({ type: 'weight', value: Number(inputWeight) });
            setInputWeight('');
        }
    };
    const handleSubmitBlood = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputBlood) {
            // Mapping blood group to a number or string as needed
            logMetricMutation.mutate({ type: 'blood_pressure', value: 0 }); // Placeholder
            setInputBlood('');
        }
    };

    const isPending = sessionPending || metricsLoading;

    return (
        <div className="min-h-screen p-4 md:p-8 font-poppins">
            <div className="mb-8">
                {isPending ? (
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-64 bg-gray-100 animate-pulse rounded"></div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user.name || 'User'}!</h1>
                        <p className="text-gray-500">{session?.user.email}</p>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
                            <img src="/height.svg" alt="Height" className="h-14 mb-2" />
                            {editing === 'height' ? (
                                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitHeight}>
                                    <input type="number" value={inputHeight} onChange={e => setInputHeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2 text-black" placeholder="Enter height (cm)" />
                                    <button type="submit" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">Save</button>
                                </form>
                            ) : (
                                <>
                                    <div className="text-lg font-semibold text-gray-800">Height</div>
                                    <div className="text-2xl font-bold text-blue-600">{height !== null ? `${height} cm` : '-- cm'}</div>
                                    <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition" onClick={() => setEditing('height')}>
                                        Add Height
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
                            <img src="/weight.svg" alt="Weight" className="h-14 mb-2" />
                            {editing === 'weight' ? (
                                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitWeight}>
                                    <input type="number" value={inputWeight} onChange={e => setInputWeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2 text-black" placeholder="Enter weight (kg)" />
                                    <button type="submit" className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition">Save</button>
                                </form>
                            ) : (
                                <>
                                    <div className="text-lg font-semibold text-gray-800">Weight</div>
                                    <div className="text-2xl font-bold text-green-600">{weight !== null ? `${weight} kg` : '-- kg'}</div>
                                    <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition" onClick={() => setEditing('weight')}>
                                        Add Weight
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
                            <img src="/blood.svg" alt="Blood Group" className="h-14 mb-2" />
                            {editing === 'blood' ? (
                                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitBlood}>
                                    <select value={inputBlood} onChange={e => setInputBlood(e.target.value)} className="w-full text-center border rounded p-1 mb-2 text-black">
                                        <option value="">Select blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                    <button type="submit" className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition">Save</button>
                                </form>
                            ) : (
                                <>
                                    <div className="text-lg font-semibold text-gray-800">Blood Group</div>
                                    <div className="text-2xl font-bold text-red-600">{blood !== null ? blood : '--'}</div>
                                    <button className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition" onClick={() => setEditing('blood')}>
                                        Add Blood Group
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
                            <img src="/bmi.svg" alt="BMI" className="h-14 mb-2" />
                            <div className="text-lg font-semibold text-gray-800">BMI</div>
                            <div className="text-2xl font-bold text-purple-600">{height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : '--'}</div>
                            <div className="text-xs text-gray-500">Add height and weight to calculate BMI</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-2 0v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7zm0 18a2 2 0 002-2h-4a2 2 0 002 2z" fill="#2563eb" /></svg>
                                </span>
                                <span className="font-semibold text-gray-800">Upcoming Doctor Visits</span>
                            </div>
                            {upcomingMeetups.length === 0 ? (
                                <div className="text-gray-400 italic">No visits scheduled.</div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {upcomingMeetups.map((meetup, idx) => (
                                        <div key={idx} className="flex items-center py-2">
                                            <span className="font-semibold text-base text-gray-900">{meetup.doctor}</span>
                                            <span className="ml-auto text-gray-500 text-sm">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2C10.34 2 9 3.34 9 5c0 2.5 3 7 3 7s3-4.5 3-7c0-1.66-1.34-3-3-3z" fill="#2563eb" /></svg>
                                </span>
                                <span className="font-semibold text-gray-800">Hydration</span>
                                <span className="ml-auto text-xs text-gray-400">Manual</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{todayHydration !== null ? `${todayHydration}L` : '--'} <span className="text-gray-400 text-base font-normal">/ 3L</span></div>
                            <div className="text-sm text-green-600 mb-2">{todayHydration !== null ? 'Good progress!' : 'No hydration logged.'}</div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: todayHydration !== null ? `${Math.min((todayHydration / 3) * 100, 100)}%` : '0%' }}></div>
                            </div>
                            <Link href="/hydration" className="mt-2 ml-auto flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                                <span className="text-lg font-bold">+</span> Add
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-red-500 text-white rounded-2xl shadow p-6 flex flex-col items-center justify-center gap-4">
                        <div className="text-lg font-semibold text-center">Keep Your Health Records Organized!</div>
                        <div className="text-center text-sm">Easily add and manage your important health documents in one place.</div>
                        <Link href="/health-vault" className="bg-white text-red-500 font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow hover:bg-gray-100 transition">
                            <span className="text-xl font-bold">+</span> Add New
                        </Link>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-100 text-yellow-600 rounded-full p-2">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-2 0v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7zm0 18a2 2 0 002-2h-4a2 2 0 002 2z" fill="#eab308" /></svg>
                            </span>
                            <span className="font-semibold text-gray-800">Tip of the Day</span>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-xl p-4 text-white">
                            <div className="font-bold mb-1">Ayurvedic Wisdom</div>
                            <div className="text-sm">Try a warm cup of haldi doodh (turmeric milk) before bed to improve sleep quality and reduce inflammation.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
