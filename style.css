const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Route checking assignment interaction parameters dynamically
app.post('/api/chat', (req, res) => {
    const { message, username, quizStage } = req.body;
    let reply = "";
    let nextQuizStage = quizStage;

    if (message === '__INIT_GREETING__') {
        reply = `Hi ${username}, how are you doing today? Welcome to Guru Studios! Let's test your understanding of what our website does. First question: What are the three core creative fields displayed on this site?`;
        nextQuizStage = 1;
        return res.json({ reply, nextQuizStage });
    }

    switch(parseInt(quizStage)) {
        case 1:
            const ans1 = message.toLowerCase();
            if (ans1.includes('design') && ans1.includes('photography') && ans1.includes('invitation')) {
                reply = `Excellent work, ${username}! That's completely correct. Our dimensions span Design, Photography, and Invitation suites. Let's finish with the final checks: What studio network signature powers the footer architecture framework of this page?`;
                nextQuizStage = 2;
            } else {
                reply = `Not quite, ${username}. Take a quick look across the portfolio capabilities grid modules layout on the page and name all three fields together.`;
            }
            break;
            
        case 2:
            const ans2 = message.toLowerCase();
            if (ans2.includes('shadow studios')) {
                reply = `Outstanding evaluation alignment, ${username}! You've successfully passed the verification test. This workflow pipeline is fully secure and operational!`;
                nextQuizStage = 3;
            } else {
                reply = `Look closely at the lower footer block signature element line, ${username}. Which studio group handles the layout?`;
            }
            break;

        default:
            reply = `Understood, ${username}. Your query containing: "${message}" has been integrated down the structural monitoring pipe.`;
            break;
    }

    res.json({ reply, nextQuizStage });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Assignment platform running on port ${PORT}`);
});
