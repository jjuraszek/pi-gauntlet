anonymized: true
- opening-shape: mechanical: matches /## Today\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\n## The change\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\n## What I checked\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\nRecommendation:/
- premise: judged: Before the approaches message, the premise note traces the dump restore to demo_vector and states that this required extension is missing from the supplied installed-extension listing.
- approaches: judged: Before presenting approaches in the separate approaches message, the output restates demo_vector as missing and names the installed-extension listing lookup.
- problem: judged: The spec ## Problem excerpt retains the missing demo_vector capability and its installed-extension listing lookup.
- continues: judged: The output supplies approaches despite the degraded scout and missing extension, without asking the user to locate or verify the extension first.
- replay: judged: The output uses the supplied observations rather than claiming a live database lookup, and does not confuse not installed with unavailable for installation.
