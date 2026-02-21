import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const VehicleSelector: React.FC = () => {
    const { language, setVehicle, vehicle } = useAppContext();
    const navigate = useNavigate();

    const [selectedMake, setSelectedMake] = useState<string>(vehicle?.make || '');
    const [selectedModel, setSelectedModel] = useState<string>(vehicle?.model || '');
    const [selectedYear, setSelectedYear] = useState<string>(vehicle?.year || '');

    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/vehicles/makes')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setMakes(data.data);
                }
            })
            .catch(err => console.error("Error fetching makes:", err));
    }, []);

    useEffect(() => {
        if (selectedMake) {
            fetch(`/api/vehicles/models/${selectedMake}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        setModels(data.data);
                    }
                })
                .catch(err => console.error("Error fetching models:", err));
        } else {
            setModels([]);
            setSelectedModel('');
            setYears([]);
            setSelectedYear('');
        }
    }, [selectedMake]);

    useEffect(() => {
        if (selectedMake && selectedModel) {
            fetch(`/api/vehicles/years/${selectedMake}/${selectedModel}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        setYears(data.data);
                    }
                })
                .catch(err => console.error("Error fetching years:", err));
        } else {
            setYears([]);
            setSelectedYear('');
        }
    }, [selectedMake, selectedModel]);

    useEffect(() => {
        if (selectedMake !== vehicle?.make) {
            setSelectedModel('');
            setSelectedYear('');
        }
    }, [selectedMake, vehicle?.make]);

    useEffect(() => {
        if (selectedModel !== vehicle?.model) {
            setSelectedYear('');
        }
    }, [selectedModel, vehicle?.model]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMake && selectedModel && selectedYear) {
            setVehicle({ make: selectedMake, model: selectedModel, year: selectedYear });
            // Redirect to category page after selecting a vehicle
            navigate('/shop');
        }
    };

    return (
        <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 max-w-4xl mx-auto">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
                <div className="flex flex-col text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
                        {language === 'en' ? 'Make' : 'Μάρκα'}
                    </label>
                    <select
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(e.target.value)}
                        className="custom-select w-full border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-accent/20 text-slate-900 font-semibold py-2 px-3 outline-none rounded-md cursor-pointer hover:bg-slate-50 transition-all"
                    >
                        <option value="">{language === 'en' ? 'Select Make' : 'Επιλέξτε Μάρκα'}</option>
                        {makes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="flex flex-col text-left border-t md:border-t-0 md:border-l border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 mt-2 md:mt-0">
                        {language === 'en' ? 'Model' : 'Μοντέλο'}
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={!selectedMake || models.length === 0}
                        className="custom-select w-full border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-accent/20 text-slate-900 font-semibold py-2 px-3 outline-none rounded-md cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
                    >
                        <option value="">{language === 'en' ? 'Select Model' : 'Επιλέξτε Μοντέλο'}</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="flex flex-col text-left border-t md:border-t-0 md:border-l border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 mt-2 md:mt-0">
                        {language === 'en' ? 'Year' : 'Χρονιά'}
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        disabled={!selectedModel || years.length === 0}
                        className="custom-select w-full border border-transparent focus:border-slate-200 focus:ring-2 focus:ring-accent/20 text-slate-900 font-semibold py-2 px-3 outline-none rounded-md cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
                    >
                        <option value="">{language === 'en' ? 'Select Year' : 'Επιλέξτε Χρονιά'}</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
            <button
                type="submit"
                disabled={!selectedMake || !selectedModel || !selectedYear}
                className="bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-base transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <span className="material-symbols-outlined text-xl">search</span>
                {language === 'en' ? 'Find Parts' : 'Εύρεση'}
            </button>
        </form>
    );
};
