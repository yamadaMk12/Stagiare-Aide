<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'contenu' => $this->description,
            'prix' => $this->prix,
            'statut' => $this->statut,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'auteur' => [
                'name' => $this->user->name,
                'filiere' => $this->user->profil->filiere ?? null,
            ],
            'images' => $this->images,
            'technologies' => $this->technologies->map(function ($tech) {
                $techArray = $tech->toArray();
                if (isset($techArray['pivot'])) {
                    $pivot = $techArray['pivot'];
                    unset($techArray['pivot']);
                    return array_merge($techArray, $pivot);
                }
                return $techArray;
            }),
            'nb_candidatures' => $this->candidatures_count ?? $this->candidatures()->count(),
        ];
    }
}
