import React, { useState, useEffect } from 'react';

export default function Translate() {
	const [input, setInput] = useState('');
	const [output, setOutput] = useState('');
	const [sourceLanguageCode, setSourceLanguageCode] = useState('');
	const [translateLanguageCode, setTranslateLanguageCode] = useState('');
	const [languageList, setLanguageList] = useState([]);
	const handleInput = (e) => {
		setInput(e.target.value);
	};
	const detectSourceLanguageCode = async () => {
		let data = {
			q: input,
		};
		try {
			let response = await fetch('https://libretranslate.com/detect', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			let obj = await response.json();
			if (obj.response !== 200) {
				throw obj.error;
			}
			return obj[0].language;
		} catch (e) {
			console.log(e);
		}
	};
	const getLanguages = async () => {
		let data = await fetch('https://libretranslate.com/languages');
		let obj = await data.json();
		return obj;
	};
	useEffect(() => {
		// returns a promise
		getLanguages().then((data) => {
			setLanguageList(data);
		});
	}, []);
	const handleLanguageChange = (e) => {
		setTranslateLanguageCode(e.target.value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		detectSourceLanguageCode().then((data) => {
			setSourceLanguageCode(data);
		});
		let data = {
			q: input,
			source: sourceLanguageCode,
			target: translateLanguageCode,
		};
		try {
			let response = await fetch('https://libretranslate.de/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			let obj = await response.json();
			if (obj.response !== 200) {
				throw obj.error;
			}
			setOutput(obj.translatedText);
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div>
			<input type='text' onChange={handleInput} />
			<form onSubmit={handleSubmit}>
				<select name='language' onChange={handleLanguageChange}>
					{languageList &&
						languageList.map((lang) => (
							<option value={lang.code} key={lang.code}>
								{lang.name}
							</option>
						))}
				</select>
				<button type='submit'>Translate</button>
			</form>
			{output ? output : 'output will appear here'}
		</div>
	);
}
