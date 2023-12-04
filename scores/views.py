# scores/views.py

from django.shortcuts import render
from django.views import View
from django.core.cache import cache
from .models import User, UserScore

class UserScoreView(View):
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        scores = []

        for user in users:
            score = cache.get(f'user:{user.id}:score')
            if score is None:
                score = UserScore.objects.get_or_create(user=user)[0].score
                cache.set(f'user:{user.id}:score', score)

            scores.append({'user': user, 'score': score})

        return render(request, 'scores/scores.html', {'scores': scores})
